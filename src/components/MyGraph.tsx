import { useEffect, useRef } from 'react';
import { type Edge, Network, type Node } from 'vis-network';

export function MyGraph(props: { nodes: Node[]; edges: Edge[] }) {
  const visRef = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    if (visRef.current) {
      new Network(
        visRef.current,
        {
          nodes: props.nodes,
          edges: props.edges,
        },
        {
          autoResize: false,
        },
      );
    }
  }, [visRef, props.edges, props.nodes]);
  return <div ref={visRef} style={{ height: '100%', width: '100%' }} />;
}
