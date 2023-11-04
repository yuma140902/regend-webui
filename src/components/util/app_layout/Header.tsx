import { Layout, Menu, Space, Switch, Tooltip, theme } from 'antd';
import { ReactElement } from 'react';
import { AppTitle } from './AppTitle';
import { GitHubLink } from './GitHubLink';

type Props = {
  height: number;
  isDarkMode: boolean;
  setIsDarkMode: (_: boolean) => void;
  appIcon: string;
  appName: string;
  handleOpenAboutDialog: () => void;
  githubUrl?: string;
  menubar?: ReactElement<typeof Menu>;
  onChangeTheme?: (isDarkMode: boolean) => void;
};

/**
 * アプリケーションのヘッダー
 */
export function Header({
  height,
  isDarkMode,
  setIsDarkMode,
  appIcon,
  appName,
  handleOpenAboutDialog,
  githubUrl,
  menubar,
  onChangeTheme,
}: Props) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout.Header
      style={{
        ...{
          width: '100%',
          display: 'flex',
          paddingLeft: '0',
          paddingRight: '3px',
        },
        ...(isDarkMode ? {} : { background: colorBgContainer }),
      }}
    >
      <AppTitle
        handleClick={handleOpenAboutDialog}
        height={height}
        appIcon={appIcon}
        appName={appName}
      />
      {menubar}
      <Space style={{ float: 'right', marginLeft: 'auto' }}>
        <Tooltip title="テーマ" placement="bottom">
          <Switch
            checkedChildren="Dark"
            unCheckedChildren="Light"
            checked={isDarkMode}
            onChange={(checked) => {
              setIsDarkMode(checked);
              if (onChangeTheme) onChangeTheme(checked);
            }}
          />
        </Tooltip>
      </Space>
      {githubUrl ? (
        <GitHubLink isDarkMode={isDarkMode} githubUrl={githubUrl} />
      ) : undefined}
    </Layout.Header>
  );
}
