import * as React from 'react';
import { Amplify } from 'aws-amplify';
import { createAIHooks, AIConversation } from '@aws-amplify/ui-react-ai';
import { generateClient } from 'aws-amplify/api';
import ReactMarkdown from 'react-markdown';
import '@aws-amplify/ui-react/styles.css';
import '@aws-amplify/ui-react-ai/ai-conversation-styles.css';
import { GlobalStyle } from '@aws-amplify/ui-react/server';

import outputs from './amplify_outputs';
import type { Schema } from '@environments/ai/gen2/amplify/data/resource';
import { Authenticator, Button, Card, Flex } from '@aws-amplify/ui-react';
import { useRouter } from 'next/router';

const client = generateClient<Schema>({ authMode: 'userPool' });
const { useAIConversation } = createAIHooks(client);

Amplify.configure(outputs);

// const responseComponents = {
//   WeatherCard: {
//     description: 'Used to display the weather in a city',
//     component: ({ city }) => {
//       return (
//         <Card variation="outlined">
//           <h3>Weather Card {city}</h3>
//         </Card>
//       );
//     },
//     props: {
//       city: {
//         type: 'string',
//         description: 'The city to get the weather for',
//       },
//     },
//   },
// } as const;

function Chat() {
  const [
    {
      data: { messages },
      isLoading,
    },
    sendMessage,
  ] = useAIConversation('chat');
  return (
    <AIConversation
      messages={messages}
      isLoading={isLoading}
      handleSendMessage={sendMessage}
      messageRenderer={{
        text: (message) => <ReactMarkdown>{message}</ReactMarkdown>,
      }}
      // responseComponents={responseComponents}
    />
  );
}

// function Chat() {
//   return null;
// }

export default function Example() {
  const router = useRouter();

  const [
    {
      data: { messages },
      isLoading,
    },
    sendMessage,
  ] = useAIConversation('pirateChat', {
    onInitialize(conversation) {
      console.log('onInitialize', conversation);
      router.replace(
        `/ui/components/ai/ai-conversation-streaming/${conversation.id}`
      );
    },
  });

  return (
    <Authenticator>
      <Flex direction="row">
        <Card flex="1" variation="outlined" height="400px" margin="large">
          <AIConversation
            messages={messages}
            isLoading={isLoading}
            handleSendMessage={sendMessage}
            messageRenderer={{
              text: (message) => <ReactMarkdown>{message}</ReactMarkdown>,
            }}
            // responseComponents={responseComponents}
          />
        </Card>
      </Flex>

      <GlobalStyle
        styles={{
          code: {
            backgroundColor: 'var(--amplify-colors-background-tertiary)',
          },
          pre: {
            backgroundColor: 'var(--amplify-colors-background-tertiary)',
            display: 'block',
            padding: '1rem',
          },
        }}
      />
    </Authenticator>
  );
}