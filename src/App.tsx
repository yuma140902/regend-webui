import { useState } from 'react';
import { AppLayout } from './components/util/AppLayout';
import AppIcon from './assets/regend.png';
import AppIconDark from './assets/regend-dark.png';
import { MonacoEditor } from './components/util/MonacoEditor';
import { Typography } from 'antd';

const HEADER_HEIGHT = 64;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <AppLayout
      appName="Regend WebUI"
      appIcon={AppIcon}
      appIconDark={AppIconDark}
      appVersion={`${__COMMIT_ID__} (${__GIT_BRANCH__} ブランチ)`}
      appGithubRepo="yuma140902/regend-webui"
      appDescription="正規表現をNFA・DFAに変換"
      headerHeight={HEADER_HEIGHT}
      defaultIsDarkMode={isDarkMode}
      onChangeTheme={setIsDarkMode}
    >
      <Typography>正規表現を入力</Typography>
      <MonacoEditor isDarkMode={isDarkMode} />
    </AppLayout>
  );
}

export default App;
