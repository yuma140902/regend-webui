import { Button, ConfigProvider, Layout, Menu, Modal, theme } from 'antd';
import { ReactElement, ReactNode, useState } from 'react';
import './AppLayout.css';
import { Header } from './app_layout/Header';
import { AboutApp } from './app_layout/AboutApp';

type Props = {
  appName: string;
  appIcon: string;
  appIconForAboutPage?: string;
  appIconForHeader?: string;
  appVersion: string;
  appGithubRepo: string;
  appDescription: string | ReactElement;
  headerHeight: number;
  children?: ReactNode;
  defaultIsDarkMode?: boolean;
  menubar?: ReactElement<typeof Menu>;
  onChangeTheme?: (isDarkMode: boolean) => void;
};

/**
 * アプリケーションの外枠となるもの
 */
export function AppLayout({
  appName,
  appIcon,
  appIconForAboutPage,
  appIconForHeader,
  appVersion,
  appGithubRepo,
  appDescription,
  headerHeight,
  children,
  defaultIsDarkMode,
  menubar,
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
          appIcon={appIconForHeader ?? appIcon}
          appName={appIconForHeader ? '' : appName}
          handleOpenAboutDialog={handleOpenAboutDialog}
          githubUrl={`https://github.com/${appGithubRepo}`}
          menubar={menubar}
          onChangeTheme={onChangeTheme}
        />
        <Layout.Content style={{ display: 'flex', width: '100%' }}>
          {children}
        </Layout.Content>
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
          appIcon={appIconForAboutPage ?? appIcon}
          appName={appName}
          githubRepo={appGithubRepo}
          version={appVersion}
          description={appDescription}
        />
      </Modal>
    </ConfigProvider>
  );
}
