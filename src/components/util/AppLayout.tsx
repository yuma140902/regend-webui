import { Button, ConfigProvider, Layout, Modal, theme } from 'antd';
import { ReactNode, useState } from 'react';
import './AppLayout.css';
import { Header } from './app_layout/Header';
import { AboutApp } from './app_layout/AboutApp';

type Props = {
  appName: string;
  appIcon: string;
  appIconDark?: string;
  appVersion: string;
  appGithubRepo: string;
  appDescription: string;
  headerHeight: number;
  children?: ReactNode;
  defaultIsDarkMode?: boolean;
  onChangeTheme?: (isDarkMode: boolean) => void;
};

/**
 * アプリケーションの外枠となるもの
 */
export function AppLayout({
  appName,
  appIcon,
  appIconDark,
  appVersion,
  appGithubRepo,
  appDescription,
  headerHeight,
  children,
  defaultIsDarkMode,
  onChangeTheme,
}: Props) {
  const [isDarkMode, setIsDarkMode] = useState(defaultIsDarkMode ?? false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);

  const handleOpenAboutDialog = () => {
    setIsAboutDialogOpen(true);
  };
  const handleCloseAboutDialog = () => {
    setIsAboutDialogOpen(false);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Layout: {
            headerHeight,
          },
        },
      }}
    >
      <Layout style={{ minHeight: '100%' }}>
        <Header
          height={headerHeight}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          appIcon={isDarkMode && appIconDark ? appIconDark : appIcon}
          appName={appName}
          handleOpenAboutDialog={handleOpenAboutDialog}
          githubUrl={`https://github.com/${appGithubRepo}`}
          menubar={undefined}
          onChangeTheme={onChangeTheme}
        />
        <Layout.Content>{children}</Layout.Content>
      </Layout>
      <Modal
        open={isAboutDialogOpen}
        closable={false}
        onCancel={handleCloseAboutDialog}
        onOk={handleCloseAboutDialog}
        footer={
          <Button type="default" onClick={handleCloseAboutDialog}>
            閉じる
          </Button>
        }
      >
        <AboutApp
          appIcon={isDarkMode && appIconDark ? appIconDark : appIcon}
          appName={appName}
          githubRepo={appGithubRepo}
          version={appVersion}
          description={appDescription}
        />
      </Modal>
    </ConfigProvider>
  );
}
