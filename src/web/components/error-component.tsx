import { Button, Code, Flex, Heading, Text } from "@radix-ui/themes";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { memo } from "react";
import Icon from "./icon";

export const ErrorComponent = memo((props: ErrorComponentProps) => {
  return (
    <Flex
      direction="column"
      className="w-full h-screen bg-red-50 px-20"
      align="start"
      justify="center"
      gap="3"
    >
      <Flex
        id="drag-region"
        p="6"
        className="absolute z-10 top-0 left-0 w-full"
      />
      <Flex direction="column">
        <Heading size="8" weight="bold" className="text-red-600">
          Something went wrong
        </Heading>
        <Text size="4" className="text-red-400">
          {props.error.message}
        </Text>
      </Flex>
      {import.meta.env.DEV && (
        <Button
          onClick={() => props.reset()}
          className="cursor-pointer space-x-1"
          variant="soft"
          color="tomato"
          size="1"
        >
          <Text size="1">Reset Window</Text>
          <Icon name="RefreshCw" size={9} />
        </Button>
      )}
      <Code size="2" color="tomato" variant="soft">
        {props.info?.componentStack}
      </Code>
    </Flex>
  );
});
