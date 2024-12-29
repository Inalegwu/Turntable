import { Icon } from "@components/index";
import { Button, Dialog, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import t from "@shared/config";
import { capitalize, generateId, providers } from "@src/shared/utils";
import { AnimatePresence } from "motion/react";
import type React from "react";
import { memo, useCallback, useEffect } from "react";
import { appState, stage } from "../state";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { mutate: minimizeWindow } = t.window.minimize.useMutation();
  const { mutate: closeWindow } = t.window.closeWindow.useMutation();

  const colorMode = appState.use.colorMode();
  const firstLaunch = appState.use.firstLaunch();
  const toggleColorMode = appState.use.toggleColorMode();
  const setAppId = appState.use.setAppId();

  const stageState = stage.use.providers();
  const _stage = Array.from(stageState.values());

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

  useEffect(() => {
    if (colorMode === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    (() => {
      if (firstLaunch) {
        setAppId(generateId());
      }
    })();
  }, [colorMode, firstLaunch, setAppId]);

  return (
    <AnimatePresence mode="wait" initial={true} presenceAffectsLayout>
      <Flex
        width="100%"
        direction="column"
        id={colorMode === "dark" ? "darkspace" : "lightspace"}
        grow="1"
        className="transition"
      >
        <Flex
          align="center"
          justify="between"
          width="100%"
          className="absolute px-3 py-2"
        >
          <Flex align="center" justify="start" gap="2">
            <button onClick={() => toggleColorMode()} className="px-2 py-1">
              <Icon
                className={colorMode === "dark" ? "text-white" : "text-black"}
                name={colorMode === "dark" ? "Sun" : "Moon"}
                size={10}
              />
            </button>
            <InfoButton />
          </Flex>
          <Flex
            id="drag-region"
            grow="1"
            align="center"
            justify="center"
            direction="row"
            p="3"
          />
          <Flex align="center" justify="end" gap="4">
            <button
              className="text-neutral-600"
              onClick={() => minimizeWindow()}
            >
              <Icon name="Minus" size={10} />
            </button>
            <button onClick={() => closeWindow()} className="text-red-600">
              <Icon name="X" size={10} />
            </button>
          </Flex>
        </Flex>
        {children}
        <Flex
          align="center"
          justify="start"
          gap="3"
          className="absolute bottom-3 left-3"
        >
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button size="1" variant="soft" className="cursor-pointer">
                <Text>Select a Provider</Text>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content size="1" variant="soft">
              {providers
                .sort((a, b) => (a.provider[0] > b.provider[0] ? 1 : -1))
                .map((provider) => (
                  <DropdownMenu.CheckboxItem
                    className="cursor-pointer"
                    checked={!!stageState.has(provider.provider)}
                    onClick={() => addProviderToStage(provider.provider)}
                    key={`${provider.provider}`}
                  >
                    <Flex align="center" justify="start" gap="2">
                      <img
                        src={provider.img}
                        className="w-2 h-2"
                        alt={`${provider.provider}`}
                      />
                      <Text size="1" color="gray">
                        {capitalize(provider.provider)}
                      </Text>
                    </Flex>
                  </DropdownMenu.CheckboxItem>
                ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>
      </Flex>
    </AnimatePresence>
  );
}

const InfoButton = memo(() => {
  const colorMode = appState.use.colorMode();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <button className="px-2 py-1">
          <Icon
            className={colorMode === "dark" ? "text-white" : "text-black"}
            name="Info"
            size={10}
          />
        </button>
      </Dialog.Trigger>
      <Dialog.Content aria-description="about">
        <Flex direction="column" gap="3" align="start">
          <Dialog.Title>
            <Text>About</Text>
          </Dialog.Title>
          <Text size="3">
            TurnTable is designed to ease migration from various music streaming
            services
          </Text>
          <Text size="3">
            &copy; 2024 <Text color="violet">DisgruntledDevs</Text>
          </Text>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
});
