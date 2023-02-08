import CytoscapeComponent from 'react-cytoscapejs';
import data from './data.json'

function App() {
  const elements = [
    // Nodes
    { data: { id: 'host1', type: 'rectangle', label: 'Host 1' } },
    { data: { id: 'host2', type: 'rectangle', label: 'Host 2' } },
    { data: { id: 'h1c1', parent: 'host1', type: 'ellipse', label: 'core 1' }, position: { x: 215, y: 5 } },
    { data: { id: 'h1c2', parent: 'host1', type: 'ellipse', label: 'core 2' }, position: { x: 265, y: 5 } },
    { data: { id: 'h1c3', parent: 'host1', type: 'ellipse', label: 'core 3' }, position: { x: 215, y: 55 } },
    { data: { id: 'h1c4', parent: 'host1', type: 'ellipse', label: 'core 4' }, position: { x: 265, y: 55 } },
    { data: { id: 'h2c1', parent: 'host2', type: 'ellipse', label: 'core 1' }, position: { x: 700, y: 105 } },
    { data: { id: 'h2c2', parent: 'host2', type: 'ellipse', label: 'core 2' }, position: { x: 750, y: 105 } },
    { data: { id: 'connection', type: 'diamond', label: '' }, position: { x: 500, y: 75 } },
    { data: { id: 'disk', type: 'rectangle', label: 'Disk' }, position: { x: 15, y: 5 } },

    // Edges
    { data: { id: 'disk-to-host1', source: 'disk', target: 'host1', label: '' } },
    { data: { id: 'host1-connection', source: 'host1', target: 'connection', label: 'Link1' } },
    { data: { id: 'host2-connection', source: 'host2', target: 'connection', label: 'Link2' } },
  ];
  const stylesheet = [
    {
      selector: 'node',
      css: {
        'shape': 'data(type)',
        'label': 'data(label)'
      }
    },
    {
      selector: ':parent',
      css: {
        'text-valign': 'top',
        'text-halign': 'center',
        'padding': '60px',
      }
    },
    {
      selector: 'edge',
      css: {
        'curve-style': 'bezier',
        'label': 'data(label)'
      }
    },
    {
      selector: '#disk',
      css: {
        'background-image': 'https://cdn-icons-png.flaticon.com/512/227/227889.png',
        'height': 120,
        'width': 120,
        'background-fit': 'contain',
        'background-color': '#ffffff',
      }
    },
  ];
  return (
    <CytoscapeComponent 
      elements={elements} 
      style={{ width: '1800px', height: '1800px' }} 
      stylesheet={stylesheet} />
  );
}

export default App;
