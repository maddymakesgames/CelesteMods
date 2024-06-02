import type { NextPage } from "next";
import Link from "next/link";
import { Flex, ScrollArea, Title, createStyles } from "@mantine/core";
import { Layout } from "~/components/layout/layout";
import { OLYMPUS_INSTALLATION_URL } from "~/consts/olympusInstallationUrl";
import { pageContentHeightPixels } from "~/styles/pageContentHeightPixels";
import { pageTitle } from "~/styles/pageTitle";




const useStyles = createStyles(
    (theme) => {
        return ({
            scrollArea: {
                height: `${pageContentHeightPixels}px`,
                color: theme.white,
                "h2": {
                    margin: `0 ${theme.spacing.sm} ${theme.spacing.xs}`,
                },
                "h3": {
                    margin: `0 ${theme.spacing.sm} ${theme.spacing.xs}`,
                },
                "h4": {
                    margin: `0 ${theme.spacing.sm} ${theme.spacing.xs}`,
                },
                "p": {
                    margin: `0 ${theme.spacing.sm} ${theme.spacing.xs}`,
                },
            },
            innerFlex: {
                flex: 1,
            },
            link: {
                textDecoration: "underline",
            },
            pageTitle,
        });
    }
);




const FAQ: NextPage = () => {
    const { classes } = useStyles();


    return (
        <Layout
            pageTitle="FAQ"
            pageDescription="FAQ"
            pathname="/faq"
        >
            <Title className={classes.pageTitle} order={1} >
                FAQ
            </Title>
            <ScrollArea
                offsetScrollbars
                className={classes.scrollArea}
            >
                <Flex
                    direction="row"
                    wrap="nowrap"
                    justify="space-between"
                >
                    <Flex
                        className={classes.innerFlex}
                        direction="column"
                        wrap="wrap"
                    >
                        <h2>Installing Mods</h2>
                        <h3>Everest</h3>
                        <p>
                            Everest is the modding API for Celeste. It is required to install most mods, and is installed automatically when setting up Olympus. If you need to install Everest manually, you can find it on their <Link href={"https://github.com/EverestAPI/Everest/releases"} className={classes.link}>GitHub</Link>.
                        </p>
                        <h3 id="mod_managers">Mod Managers</h3>
                        <h4>Olympus</h4>
                        <p>
                            Olympus is the recommended mod manager for Celeste. Everest is installed automatically during setup. You can find installation instructions for Windows, Mac, and Linux on the <Link href={OLYMPUS_INSTALLATION_URL} className={classes.link}>Everest website</Link>.
                        </p>
                        <h4>CeleMod</h4>
                        <p>
                            CeleMod is a new alternative mod manager for Celeste. You can find installation instructions on <Link href={"https://gamebanana.com/tools/16200"} className={classes.link}>GameBanana</Link>.
                        </p>
                    </Flex>
                    <Flex
                        className={classes.innerFlex}
                        direction="column"
                        wrap="wrap"
                    >
                        <h4>Mons</h4>
                        <p>
                            Mons is a commandline Everest installer and mod manager for Celeste. You can find installation instructions on <Link href={"https://github.com/coloursofnoise/mons"} className={classes.link}>their GitHub</Link>.
                        </p>
                        <h2>Known Issues</h2>
                        <h4><Link href="https://github.com/celestemods-com/CelesteMods/issues/724" className={classes.link}>Difficulty Header Separated From Info Header</Link></h4>
                        <p>
                            The difficulty tabs are separated from the Mods Table in Safari and other Webkit-based browsers. We are aware of this issue and plan to fix it in the future, but it is not currently a high-priority.
                        </p>
                        <h4>Other Issues</h4>
                        <p>
                            There are other known issues as well, tracked on our <Link href="https://github.com/celestemods-com/CelesteMods/issues" className={classes.link}>GitHub</Link>. If you encounter an issue that is not listed there, please <Link href="https://github.com/celestemods-com/CelesteMods/blob/main/CONTRIBUTING.md?#filing-a-bug-report" className={classes.link}>open a new issue</Link>.
                        </p>
                        <h2>Other FAQ</h2>
                        <p>Coming soon!</p>
                    </Flex>
                </Flex>
            </ScrollArea>
        </Layout>
    );
};

export default FAQ;