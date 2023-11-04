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

function get_node_position(count: number, max: number): [number, number] {
  const x0 = 500;
  const y0 = 500;
  const r = 450;
  const rad = (2 * Math.PI * (count - 1)) / max;
  const x = x0 + r * Math.cos(rad);
  const y = y0 + r * Math.sin(rad);
  return [x, y];
}

function dfa_to_graph(dfa: Dfa): [Node[], Edge[]] {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const dfa_states = dfa.states;
  const dfa_rules = dfa.rules;
  const dfa_start = dfa.start;

  let node_count = 0;
  const node_max = dfa_states.length;
  for (const state of dfa_states) {
    ++node_count;
    const ty = state.id == dfa_start ? 'start' : state.finish ? 'fin' : 'cont';
    const [x, y] = get_node_position(node_count, node_max);
    const node = {
      id: state.id,
      label: state.id.toString(),
    };
    nodes.push(node);
  }

  let edge_count = 0;
  for (const rule of dfa_rules) {
    ++edge_count;
    const edge = {
      id: edge_count,
      from: rule.from,
      to: rule.to,
      label: rule.alphabet.toString(),
    };
    edges.push(edge);
  }

  return [nodes, edges];
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [regexStr, setRegexStr] = useState('(a|b)*');

  const handleRegexStrUpdate = (s?: string) => {
    if (s) {
      setRegexStr(s);
      const dfa = str_to_dfa(s);
      console.log(s);
      console.log(dfa);
      const [nodes, edges] = dfa_to_graph(dfa);
      dfa.free();
      setNodes(nodes);
      setEdges(edges);
    } else {
      console.log('empty');
    }
  };

  useEffect(() => {
    handleRegexStrUpdate(regexStr);
  }, []);

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
          <MonacoEditor
            isDarkMode={isDarkMode}
            text={regexStr}
            onChange={handleRegexStrUpdate}
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
