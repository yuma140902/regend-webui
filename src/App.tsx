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
        <Typography.Title level={2}>正規表現の文法</Typography.Title>
        <Typography.Paragraph>
          Regendで使用する正規表現の文法は以下の通りです。
          <pre>{`<expr> := <orterm> [ '|' <orterm> ]*
<orterm> := <catterm> [ <catterm> ]*
<catterm> := <repterm> [ '*' ]?
<repterm> := '(' <expr> ')'
           | '0'～'9'
           | 'a'～'z'
           | 'A'～'Z'
           | 'φ'
`}</pre>
          空白や改行は無視されるので読みやすいように好きな場所に入れることができます。
        </Typography.Paragraph>
        <Typography.Title level={2}> 正規表現の意味論</Typography.Title>

        <Typography.Paragraph>
          <ul>
            <li>
              <Typography.Text code>φ</Typography.Text> - 空文字列を表す
            </li>
            <li>
              <Typography.Text code>0</Typography.Text>～
              <Typography.Text code>9</Typography.Text>,{' '}
              <Typography.Text code>a</Typography.Text>～
              <Typography.Text code>z</Typography.Text>,{' '}
              <Typography.Text code>A</Typography.Text>～
              <Typography.Text code>Z</Typography.Text> - その1文字を表す
            </li>
            <li>
              A<Typography.Text code>|</Typography.Text>B -
              正規表現Aと正規表現Bの選択
            </li>
            <li> AB - 正規表現Aと正規表現Bの連接</li>
            <li>
              A<Typography.Text code>*</Typography.Text> -
              正規表現Aの0回以上の繰り返し
            </li>
          </ul>
        </Typography.Paragraph>
        <Typography.Paragraph>
          優先順位は繰り返し、連接、選択の順に高いです。
          <Typography.Text code>(</Typography.Text>
          <Typography.Text code>)</Typography.Text>
          を使用すると優先順位を変えることができます。
        </Typography.Paragraph>

        <Typography.Paragraph>
          以下のようなよくある糖衣構文は実装していません。かわりに矢印で示した表記を使ってください。
          <ul>
            <li>
              A<Typography.Text code>?</Typography.Text> -
              正規表現Aが0回または1回出現する →{' '}
              <Typography.Text code>(φ|</Typography.Text>A
              <Typography.Text code>)</Typography.Text>
            </li>
            <li>
              A<Typography.Text code>+</Typography.Text> -
              正規表現Aの1回以上の繰り返し → AA
              <Typography.Text code>*</Typography.Text>
            </li>
          </ul>
        </Typography.Paragraph>
      </Drawer>
    </AppLayout>
  );
}

export default App;
