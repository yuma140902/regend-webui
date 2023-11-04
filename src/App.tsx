import { useEffect, useState } from 'react';
import { AppLayout } from './components/util/AppLayout';
import AppIcon from './assets/regend.png';
import AppIconDark from './assets/regend-dark.png';
import { MonacoEditor } from './components/util/MonacoEditor';
import { Col, Row, Typography } from 'antd';
import { MyGraph } from './components/MyGraph';
import { Dfa, str_to_dfa } from 'regend';
import { Edge, Node } from 'vis-network';

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

export type GraphTheme = {
  bgColor: string;
  nodeColor: string;
  nodeBorderColor: string;
  nodeLabelColor: string;
  nodeHighlightColor: string;
  edgeColor: string;
  edgeLabelColor: string;
};

function dfa_to_graph(dfa: Dfa, theme: GraphTheme): [Node[], Edge[]] {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const dfa_states = dfa.states;
  const dfa_rules = dfa.rules;
  const dfa_start = dfa.start;

  nodes.push({
    id: 0,
    color: 'transparent',
  });

  for (const state of dfa_states) {
    const node: Node = {
      id: state.id,
      label: state.id.toString(),
      color: {
        background: theme.nodeColor,
        border: theme.nodeBorderColor,
        highlight: {
          background: theme.nodeHighlightColor,
        },
      },
      font: {
        color: theme.nodeLabelColor,
      },
      borderWidth: state.finish ? 4 : 1,
      borderWidthSelected: undefined,
    };
    nodes.push(node);
  }

  edges.push({
    id: 0,
    from: 0,
    to: dfa_start,
    label: 'Start',
    color: theme.edgeColor,
    font: {
      color: theme.edgeLabelColor,
      strokeWidth: 0,
    },
    arrows: {
      to: true,
    },
  });

  let edge_count = 0;
  for (const rule of dfa_rules) {
    ++edge_count;
    const edge: Edge = {
      id: edge_count,
      from: rule.from,
      to: rule.to,
      label: rule.alphabets.split('').join(','),
      color: theme.edgeColor,
      font: {
        color: theme.edgeLabelColor,
        strokeWidth: 0,
      },
      arrows: {
        to: true,
      },
    };
    edges.push(edge);
  }

  return [nodes, edges];
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [graphTheme, setGraphTheme] = useState(
    isDarkMode ? graphThemeDark : graphThemeLight,
  );

  const [regexStr, setRegexStr] = useState('(a|b)*');

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
    >
      <Row wrap={false} style={{ flexDirection: 'column', flexGrow: 1 }}>
        <Col flex="none">
          <Typography>正規表現を入力</Typography>
          <MonacoEditor
            isDarkMode={isDarkMode}
            text={regexStr}
            onChange={(s) => {
              if (s) setRegexStr(s);
            }}
          />
        </Col>
        <Col flex="auto">
          <MyGraph nodes={nodes} edges={edges} />
        </Col>
      </Row>
    </AppLayout>
  );
}

export default App;
