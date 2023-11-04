import { useState } from 'react';
import { AppLayout } from './components/util/AppLayout';
import AppIcon from './assets/regend.png';
import AppIconDark from './assets/regend-dark.png';
import { MonacoEditor } from './components/util/MonacoEditor';
import { Col, Row, Typography } from 'antd';
import { MyGraph } from './components/MyGraph';

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
      <Row wrap={false} style={{ flexDirection: 'column', flexGrow: 1 }}>
        <Col flex="none">
          <Typography>正規表現を入力</Typography>
          <MonacoEditor isDarkMode={isDarkMode} />
        </Col>
        <Col flex="auto">
          <MyGraph />
        </Col>
      </Row>
    </AppLayout>
  );
}

export default App;
