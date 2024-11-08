<!DOCTYPE html>
<html>
<head>
  <title>CO2 Emissions Sankey Diagram</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f0f0f0;
    }
  </style>
</head>
<body>
  <div id="sketch-container"></div>

  <script>
    let emissionData = [
      { country: 'Chiny', totalEmissions: 10000, emissionsPerCapita: 7.2, emissionsPerGDP: 0.5 },
      { country: 'USA', totalEmissions: 5000, emissionsPerCapita: 15.2, emissionsPerGDP: 0.3 },
      { country: 'Indie', totalEmissions: 2500, emissionsPerCapita: 1.8, emissionsPerGDP: 0.7 },
      { country: 'Rosja', totalEmissions: 1800, emissionsPerCapita: 12.5, emissionsPerGDP: 0.4 },
      { country: 'Japonia', totalEmissions: 1200, emissionsPerCapita: 9.4, emissionsPerGDP: 0.2 }
    ];

    let sankeyWidth, sankeyHeight;
    let nodes = [];
    let links = [];

    function setup() {
      const canvas = createCanvas(800, 600);
      canvas.parent('sketch-container');
      
      calculateSankeyElements();
      
      sankeyWidth = width * 0.8;
      sankeyHeight = height * 0.8;
    }

    function draw() {
      background(240);
      
      drawSankeyDiagram();
      
      handleMouseInteraction();
    }

    function calculateSankeyElements() {
      // Obliczanie szerokości węzłów i grubości połączeń
      const totalEmissions = emissionData.reduce((sum, item) => sum + item.totalEmissions, 0);
      
      nodes = emissionData.map((item, index) => ({
        x: 100 + index * (sankeyWidth - 200) / (emissionData.length - 1),
        y: sankeyHeight / 2,
        width: 80,
        height: item.totalEmissions / totalEmissions * sankeyHeight * 0.8,
        country: item.country,
        totalEmissions: item.totalEmissions,
        emissionsPerCapita: item.emissionsPerCapita,
        emissionsPerGDP: item.emissionsPerGDP
      }));

      links = emissionData.flatMap((item, index) => {
        const linkWidth = item.totalEmissions / totalEmissions * sankeyHeight * 0.8;
        return index > 0 ? [
          { 
            source: nodes[index - 1],
            target: nodes[index],
            value: linkWidth
          }
        ] : [];
      });
    }

    function drawSankeyDiagram() {
      // Rysowanie połączeń
      stroke(150);
      strokeWeight(2);
      for (const link of links) {
        line(
          link.source.x + link.source.width, 
          link.source.y + link.source.height / 2,
          link.target.x, 
          link.target.y + link.target.height / 2
        );
      }

      // Rysowanie węzłów
      noStroke();
      for (const node of nodes) {
        const color = lerpColor(color(0, 255, 0), color(255, 0, 0), node.totalEmissions / emissionData[emissionData.length - 1].totalEmissions);
        fill(color);
        rect(node.x, node.y, node.width, node.height);
        
        fill(0);
        textAlign(CENTER, CENTER);
        text(node.country, node.x + node.width / 2, node.y + node.height / 2);
      }
    }

    function handleMouseInteraction() {
      let hoveredNode = getNodeAtMousePosition();
      
      // Podświetlenie węzła pod kursorem
      for (const node of nodes) {
        if (node === hoveredNode) {
          fill(255, 255, 0, 100);
          rect(node.x, node.y, node.width, node.height);
        }
      }
      
      // Wyświetlanie tooltipu
      if (hoveredNode) {
        push();
        fill(255);
        rect(mouseX + 10, mouseY + 10, 300, 100, 5);
        fill(0);
        text(`Kraj: ${hoveredNode.country}`, mouseX + 20, mouseY + 30);
        text(`Całkowita emisja: ${hoveredNode.totalEmissions.toLocaleString()} ton`, mouseX + 20, mouseY + 50);
        text(`Emisja/mieszkańca: ${hoveredNode.emissionsPerCapita.toFixed(1)} ton`, mouseX + 20, mouseY + 70);
        pop();
      }
    }

    function getNodeAtMousePosition() {
      for (const node of nodes) {
        if (
          mouseX > node.x &&
          mouseX < node.x + node.width &&
          mouseY > node.y &&
          mouseY < node.y + node.height
        ) {
          return node;
        }
      }
      return null;
    }
  </script>
</body>
</html>
