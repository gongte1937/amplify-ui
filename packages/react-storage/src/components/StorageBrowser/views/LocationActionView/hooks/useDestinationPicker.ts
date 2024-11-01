import { useEffect, useRef, useState } from 'react';
import { isString } from '@aws-amplify/ui';
import { usePaginate } from '../../hooks/usePaginate';
import {
  listLocationItemsHandler,
  ListLocationItemsHandlerInput,
  ListLocationItemsHandlerOutput,
} from '../../../actions/handlers/listLocationItems';
import { useGetActionInput } from '../../../providers/configuration';
import { getDestinationListFullPrefix } from '../utils/getDestinationPickerDataTable';

const DEFAULT_ERROR_MESSAGE = 'There was an error loading folders.';
const DEFAULT_PAGE_SIZE = 1000;
export const DEFAULT_LIST_OPTIONS = {
  pageSize: DEFAULT_PAGE_SIZE,
  delimiter: '/',
};

const DEFAULT_REFRESH_OPTIONS = { ...DEFAULT_LIST_OPTIONS, refresh: true };

const useLocationItems = () => {
  const [data, setData] = useState<
    ListLocationItemsHandlerOutput & {
      hasError: boolean;
      message?: string;
      isLoading: boolean;
    }
  >({
    items: [],
    nextToken: undefined,
    hasError: false,
    isLoading: false,
    message: '',
  });
  const prevPref = useRef<string>('');
  const handleList = async (input: ListLocationItemsHandlerInput) => {
    console.log('input', input);
    setData((prev) => ({ ...prev, isLoading: true }));
    try {
      const { items, nextToken } = await listLocationItemsHandler({
        config: input.config,
        prefix: input.prefix,
        options: input.options,
      });
      const newItems =
        prevPref.current !== input.prefix ? items : data.items.concat(items);
      const newData = {
        items: newItems,
        nextToken,
        isLoading: false,
        hasError: false,
      };
      setData(newData);
    } catch (error) {
      setData({
        items: [],
        nextToken: undefined,
        hasError: true,
        isLoading: false,
        message: DEFAULT_ERROR_MESSAGE,
      });
    }

    console.log('data', data);
    return [data, handleList];
  };

  return [data, handleList] as const;
};

export const useDestinationPicker = ({
  destinationList,
}: {
  destinationList: string[];
}): {
  items: ListLocationItemsHandlerOutput['items'];
  hasNextToken: boolean;
  currentPage: number;
  isLoading: boolean;
  handleNext: () => void;
  handlePrevious: () => void;
  range: [number, number];
} => {
  const previousPathref = useRef('');
  const [data, handleList] = useLocationItems();

  const getInput = useGetActionInput();

  const { items, nextToken, isLoading, hasError, message } = data;
  const resultCount = items.length;
  const hasNextToken = !!nextToken;

  const hasValidPath = isString(destinationList.join());
  const onPaginateNext = () => {
    if (!hasValidPath) return;

    handleList({
      config: getInput(),
      prefix: getDestinationListFullPrefix(destinationList),
      options: { ...DEFAULT_LIST_OPTIONS, nextToken },
    });
  };

  const { currentPage, handlePaginateNext, handlePaginatePrevious, range } =
    usePaginate({
      onPaginateNext,
      pageSize: 10,
    });
  console.log('currentPage', currentPage, 'range', range);

  useEffect(() => {
    const newPath = getDestinationListFullPrefix(destinationList);
    if (previousPathref.current !== newPath) {
      handleList({
        config: getInput(),
        prefix: newPath,
        options: { ...DEFAULT_REFRESH_OPTIONS, nextToken },
      });
    }
    previousPathref.current = newPath;
  }, [getInput, handleList, nextToken, destinationList]);

  return {
    items,
    hasNextToken,
    currentPage,
    isLoading,
    handleNext: () => {
      handlePaginateNext({ resultCount, hasNextToken });
    },
    handlePrevious: () => {
      handlePaginatePrevious();
    },
    range,
  };
};
