import { Button, Flex, Heading, Select, Text } from "@radix-ui/themes";
import { capitalize, findProviderIcon } from "@shared/utils";
import { createFileRoute } from "@tanstack/react-router";
import { stage$ } from "../state";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const stage = stage$.providers.get();

  return (
    <Flex align="center" gap="5" justify="center" className="h-screen w-full">
      {stage.length === 0 && (
        <>
          <Heading size="3">The Stage is Empty</Heading>
        </>
      )}
      {stage.map((provider) => (
        <Flex
          direction="column"
          className="w-2/6 h-4/6 bg-neutral-100/1 border-1 border-solid border-neutral-100/10 rounded-md"
          key={`${provider}__`}
        >
          <Flex
            width="100%"
            align="center"
            justify="between"
            className="h-[14%] px-2 border-b-neutral-100/8 border-b-1 border-b-solid"
          >
            <Flex direction="column" gap="1">
              <img
                src={findProviderIcon(provider)}
                className="w-8 h-8"
                alt={`${provider}_logo`}
              />
            </Flex>
            <Flex align="center" justify="end" gap="1">
              <Select.Root size="1">
                <Select.Trigger>
                  <button>Priority</button>
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="source">Source</Select.Item>
                  <Select.Item value="destination">Destination</Select.Item>
                </Select.Content>
              </Select.Root>
              <Button className="cursor-pointer" size="1" variant="outline">
                <Text>authenticate</Text>
              </Button>
            </Flex>
          </Flex>
          <Flex grow="1" width="100%" className="px-2 py-1">
            <Text>{capitalize(provider)}</Text>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
}
