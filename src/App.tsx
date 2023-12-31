import { useEffect, useState } from 'react';
import { AppLayout } from './components/util/AppLayout';
import AppLogoLight from './assets/logo-light.png';
import AppLogoDark from './assets/logo-dark.png';
import { MonacoEditor } from './components/util/MonacoEditor';
import { Col, Drawer, Menu, Row, Typography } from 'antd';
import { MyGraph } from './components/MyGraph';
import { str_to_dfa } from 'regend';
import { Edge, Node } from 'vis-network';
import { useWindowSize } from '@react-hook/window-size';
import { RegexHelp } from './components/RegexHelp';
import { GraphTheme, dfa_to_graph } from './dfa_to_graph';
import { useLocalStorage } from './hooks/useLocalStorage';
import { MenuOutlined } from '@ant-design/icons';

const HEADER_HEIGHT = 64;

const graphThemeLight: GraphTheme = {
  bgColor: 'transparent',
  nodeColor: '#97c2fc',
  nodeBorderColor: '#2b7ce9',
  nodeLabelColor: 'black',
  nodeHighlightColor: '#d2e5ff',
  edgeColor: '#2b7ce9',
  edgeLabelColor: 'black',
};

const graphThemeDark: GraphTheme = {
  bgColor: 'transparent',
  nodeColor: '#97c2fc',
  nodeBorderColor: '#2b7ce9',
  nodeLabelColor: 'black',
  nodeHighlightColor: '#d2e5ff',
  edgeColor: '#2b7ce9',
  edgeLabelColor: 'white',
};

function App() {
  const [theme, setTheme] = useLocalStorage(
    'regend-webui-theme',
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
  );
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [graphTheme, setGraphTheme] = useState(
    theme === 'dark' ? graphThemeDark : graphThemeLight,
  );

  const [regexStr, setRegexStr] = useLocalStorage(
    'regend-webui-regex',
    '(aa|ab)*',
  );
  const [regexHelpOpen, setRegexHelpOpen] = useState(false);

  const [windowWidth, windowHeight] = useWindowSize();

  const handleChangeTheme = (isDarkMode: boolean) => {
    setTheme(isDarkMode ? 'dark' : 'light');
    setGraphTheme(isDarkMode ? graphThemeDark : graphThemeLight);
  };

  useEffect(() => {
    if (regexStr) {
      try {
        const dfa = str_to_dfa(regexStr);
        const [nodes, edges] = dfa_to_graph(dfa, graphTheme);
        dfa.free();
        setNodes(nodes);
        setEdges(edges);
      } catch (e) {}
    }
  }, [graphTheme, regexStr, windowWidth, windowHeight]);

  return (
    <AppLayout
      appName="Regend WebUI"
      appIcon={theme === 'dark' ? AppLogoDark : AppLogoLight}
      appIconForHeader={theme === 'dark' ? AppLogoDark : AppLogoLight}
      appVersion={`${__COMMIT_ID__} (${__GIT_BRANCH__} ブランチ)`}
      appGithubRepo="yuma140902/regend-webui"
      appDescription={
        <Typography.Text>
          <Typography.Link
            href="https://github.com/yuma140902/regend"
            target="_blank"
          >
            regend
          </Typography.Link>
          を用いて正規表現をDFA(決定性有限オートマトン)に変換する
        </Typography.Text>
      }
      headerHeight={HEADER_HEIGHT}
      defaultIsDarkMode={theme === 'dark'}
      onChangeTheme={handleChangeTheme}
      menubar={
        <Menu
          style={{ width: 'auto', maxWidth: '50vw' }}
          overflowedIndicator={<MenuOutlined />}
          items={[
            {
              label: '正規表現の文法について',
              key: 'helpRegex',
            },
            {
              label: 'アプリ一覧',
              key: 'apps',
            },
          ]}
          mode="horizontal"
          selectable={false}
          theme={theme === 'dark' ? 'dark' : 'light'}
          onClick={({ key }: { key: string }) => {
            if (key === 'helpRegex') {
              setRegexHelpOpen(true);
            } else if (key === 'apps') {
              window.open('https://yuma14.net/apps/', '_blank');
            }
          }}
        />
      }
    >
      <Row wrap={false} style={{ flexDirection: 'column', flexGrow: 1 }}>
        <Col flex="none">
          <Typography>正規表現を入力:</Typography>
          <MonacoEditor
            isDarkMode={theme === 'dark'}
            text={regexStr}
            onChange={(s) => {
              if (s) setRegexStr(s);
            }}
          />
        </Col>
        <Col flex="auto">
          <Typography>DFA (ノードをドラッグして動かせる):</Typography>
          <MyGraph nodes={nodes} edges={edges} />
        </Col>
      </Row>

      <Drawer
        placement={windowHeight > windowWidth ? 'bottom' : 'right'}
        open={regexHelpOpen}
        onClose={() => setRegexHelpOpen(false)}
        maskStyle={{ background: 'transparent', display: 'none' }}
        height={Math.min(500, windowHeight - HEADER_HEIGHT - 50)}
      >
        <RegexHelp />
      </Drawer>
    </AppLayout>
  );
}

export default App;
