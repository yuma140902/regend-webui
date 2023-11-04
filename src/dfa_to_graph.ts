import { Dfa } from 'regend';
import { Node, Edge } from 'vis-network';

export type GraphTheme = {
  bgColor: string;
  nodeColor: string;
  nodeBorderColor: string;
  nodeLabelColor: string;
  nodeHighlightColor: string;
  edgeColor: string;
  edgeLabelColor: string;
};

export function dfa_to_graph(dfa: Dfa, theme: GraphTheme): [Node[], Edge[]] {
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
