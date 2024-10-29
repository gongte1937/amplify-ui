import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as StorageModule from '../../../storage-internal';

import { createTempActionsProvider } from '../../../do-not-import-from-here/createTempActionsProvider';
import * as ConfigModule from '../../../providers/configuration';

import { DownloadControl } from '../Download';

const getUrlSpy = jest.spyOn(StorageModule, 'getUrl');

const useGetLocationConfigSpy = jest.spyOn(ConfigModule, 'useGetActionInput');

const listLocations = jest.fn(() =>
  Promise.resolve({ locations: [], nextToken: undefined })
);

const config = {
  getLocationCredentials: jest.fn(),
  listLocations,
  region: 'region',
  registerAuthListener: jest.fn(),
};

const Provider = createTempActionsProvider({ actions: {}, config });

describe('DownloadControl', () => {
  beforeEach(() => {
    useGetLocationConfigSpy.mockReturnValue(() => ({
      bucket: 'myBucket',
      credentials: jest.fn(),
      region: 'region',
    }));
  });

  it('renders the DownloadControl', async () => {
    const fileKey = 'test.jpg';

    await waitFor(() => {
      expect(
        render(
          <Provider>
            <DownloadControl fileKey={fileKey} />
          </Provider>
        ).container
      ).toBeDefined();
    });

    const button = screen.getByRole('button', {
      name: `Download ${fileKey}`,
    });

    const icon = button.querySelector('svg');

    expect(button).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('calls getUrl onClick', async () => {
    // @TODO: mock location correctly so when the
    // click for the link to download happens, it doesn't console.error
    const user = userEvent.setup();

    getUrlSpy.mockResolvedValueOnce({
      url: new URL('https://docs.amplify.aws/'),
      expiresAt: new Date(),
    });

    render(
      <Provider>
        <DownloadControl fileKey="" />
      </Provider>
    );

    const button = screen.getByRole('button', {
      name: 'Download',
    });

    act(() => {
      user.click(button);
    });

    await waitFor(() => {
      expect(getUrlSpy).toHaveBeenCalled();
    });
  });
});