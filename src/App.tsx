import { useEffect, useState } from 'react';
import { AppLayout } from './components/util/AppLayout';
import AppIcon from './assets/regend.png';
import AppIconDark from './assets/regend-dark.png';
import { MonacoEditor } from './components/util/MonacoEditor';
import { Button, Col, Drawer, Menu, Modal, Row, Typography } from 'antd';
import { MyGraph } from './components/MyGraph';
import { Dfa, str_to_dfa } from 'regend';
import { Edge, Node } from 'vis-network';
import { useWindowHeight, useWindowSize } from '@react-hook/window-size';
import { RegexHelp } from './components/RegexHelp';
import { GraphTheme, dfa_to_graph } from './dfa_to_graph';

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [graphTheme, setGraphTheme] = useState(
    isDarkMode ? graphThemeDark : graphThemeLight,
  );

  const [regexStr, setRegexStr] = useState('(aa|ab)*');
  const [regexHelpOpen, setRegexHelpOpen] = useState(false);

  const [windowWidth, windowHeight] = useWindowSize();

  const handleChangeTheme = (b: boolean) => {
    setIsDarkMode(b);
    setGraphTheme(b ? graphThemeDark : graphThemeLight);
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
  }, [graphTheme, regexStr]);

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
      onChangeTheme={handleChangeTheme}
      menubar={
        <Menu
          items={[
            {
              label: '正規表現の文法について',
              key: 'helpRegex',
            },
          ]}
          mode="horizontal"
          selectable={false}
          theme={isDarkMode ? 'dark' : 'light'}
          onClick={({ key }: { key: string }) => {
            if (key === 'helpRegex') {
              setRegexHelpOpen(true);
            }
          }}
        />
      }
    >
      <Row wrap={false} style={{ flexDirection: 'column', flexGrow: 1 }}>
        <Col flex="none">
          <Typography>正規表現を入力:</Typography>
          <MonacoEditor
            isDarkMode={isDarkMode}
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
