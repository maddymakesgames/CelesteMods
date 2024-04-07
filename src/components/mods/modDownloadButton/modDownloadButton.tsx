import { useGamebananaModDownloadUrl } from "~/hooks/gamebananaApi";
import { Popover, Text, createStyles } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";




type ModDownloadButtonProps = {
    gamebananaModId: number;
};




const useStyles = createStyles(
    (theme) => {
        return ({
            dropdown: {
                '&&': {
                    backgroundColor: theme.white,
                    padding: '5px 10px',
                },
                "a": {
                    textDecoration: 'underline',
                },
            },
            dropdownText: {
                margin: '5px 0',
            },
            arrow: {
                backgroundColor: theme.white,
                border: 'none',
                pointerEvents: 'none',
            }
        });
    }
);




export const ModDownloadButton = ({ gamebananaModId }: ModDownloadButtonProps) => {
    const { downloadUrl } = useGamebananaModDownloadUrl({ gamebananaModId });

    const [opened, { close, open }] = useDisclosure(false);

    // Since there is a gap between the link and the popover,
    // debouncing prevents the popover from closing when we move from the link to popover.
    const [debouncedOpened] = useDebouncedValue(opened, 110);


    const { classes } = useStyles();


    return (
        <div>
            <Popover position="bottom"
                withArrow
                shadow="md"
                opened={debouncedOpened}
                classNames={{ dropdown: classes.dropdown, arrow: classes.arrow }}>
                <Popover.Target>
                    <a href={downloadUrl}
                        onMouseEnter={open}
                        onMouseLeave={close}>
                        <Text size={"md"}>
                            Olympus: 1-Click Install
                        </Text>
                    </a>
                </Popover.Target>
                <Popover.Dropdown
                    onMouseEnter={open}
                    onMouseLeave={close}>
                    <Text className={classes.dropdownText}>
                        Install the mod directly using <a href="https://everestapi.github.io/#installing-everest">Olympus</a>, a mod manager for Celeste.
                    </Text>
                    <Text className={classes.dropdownText}>
                        You could also use <a href="https://gamebanana.com/tools/16200">CeleMod</a>, a alternative mod manager.
                    </Text>
                </Popover.Dropdown>
            </Popover>
        </div>
    );
};