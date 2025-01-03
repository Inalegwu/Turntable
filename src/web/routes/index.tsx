import { Button, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import { capitalize, providers } from "@src/shared/utils";
import { createFileRoute } from "@tanstack/react-router";
import { memo, useCallback } from "react";
import { ProviderCard } from "../components";
import { stage } from "../state";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const _stage = Array.from(stage.use.providers().values());

  console.log(_stage);

  return (
    <Flex
      align="center"
      gap="4"
      justify="center"
      className="h-screen w-full px-6"
    >
      {stage.length === 0 && (
        <Flex direction="column" align="center" gap="3">
          <Flex direction="column" align="center" justify="center">
            <Text
              weight="bold"
              className="text-black dark:text-white"
              color="gray"
              size="6"
            >
              Stage is currently empty
            </Text>
            <Text weight="medium" size="4" color="gray">
              Add apps to begin transferring
            </Text>
          </Flex>
          <SelectButton />
        </Flex>
      )}
      {_stage.map((provider) => (
        <ProviderCard provider={provider} key={provider} />
      ))}
      {stage.length === 1 && (
        <Flex className="w-2/6" align="center" justify="center">
          <Text weight="medium">Add one more to get started</Text>
        </Flex>
      )}
    </Flex>
  );
}

const SelectButton = memo(() => {
  const stageState = stage.use.providers();
  const _stage = Array.from(stageState);

  const addProviderToStage = useCallback(
    (provider: Provider) => {
      if (stage.length === 2 && !stageState.has(provider)) {
        console.log("max reached");
        return;
      }

      if (stageState.has(provider)) {
        stageState.delete(provider);
        return;
      }

      stageState.add(provider);
      return;
    },
    [stageState],
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button size="2" variant="soft" className="cursor-pointer">
          <Text weight="medium" size="1">
            Select a Provider
          </Text>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content size="2" variant="soft">
        {providers
          .sort((a, b) => (a.provider[0] > b.provider[0] ? 1 : -1))
          .map((provider) => (
            <DropdownMenu.Item
              className="cursor-pointer"
              onClick={() => addProviderToStage(provider.provider)}
              key={`${provider.provider}`}
            >
              <Flex align="center" justify="start" gap="2">
                <img
                  src={provider.img}
                  className="w-4 h-4"
                  alt={`${provider.provider}`}
                />
                <Text color="gray">{capitalize(provider.provider)}</Text>
              </Flex>
            </DropdownMenu.Item>
          ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
});
