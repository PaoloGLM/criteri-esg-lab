export function XrefDiagram() {
  // Nodes: informe al centre, 6 estàndards al voltant.
  // Fix solapament: etiquetes MAI a sobre del node — sempre a l'exterior,
  // amb ancoratge segons el quadrant (esquerra: text-anchor=end des del node).
  const nodes = [
    { x: 112, y: 62, c: "#5C8A5C", nom: "GRI 305-1", sub: "Emissions directes", anchor: "start" as const, dx: 14, dy: -4 },
    { x: 448, y: 62, c: "#5C8A5C", nom: "ESRS E1-6", sub: "Transició climàtica", anchor: "end" as const, dx: -14, dy: -4 },
    { x: 66, y: 190, c: "#C9A961", nom: "TCFD", sub: "Mètriques i objectius", anchor: "start" as const, dx: 14, dy: -4 },
    { x: 494, y: 190, c: "#C9A961", nom: "Taxonomia UE", sub: "Activitat elegible", anchor: "end" as const, dx: -14, dy: -4 },
    { x: 112, y: 318, c: "#A0522D", nom: "EcoVadis ENV-1", sub: "Energia i GEH", anchor: "start" as const, dx: 14, dy: 14 },
    { x: 448, y: 318, c: "#A0522D", nom: "CDP", sub: "Qüestionari clima", anchor: "end" as const, dx: -14, dy: 14 },
  ];

  return (
    <svg viewBox="0 0 560 380" role="img" aria-label="Diagrama: un informe central connectat amb sis estàndards mitjançant el cross-reference" className="w-full">
      <defs>
        <marker id="arr" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 z" fill="#5E8772" />
        </marker>
      </defs>
      {/* arestes */}
      <g stroke="#5E8772" strokeOpacity=".45" strokeWidth="1.4" fill="none" markerEnd="url(#arr)">
        {nodes.map((n) => (
          <line key={n.nom} x1="280" y1="190" x2={n.x} y2={n.y} />
        ))}
      </g>
      {/* node central */}
      <circle cx="280" cy="190" r="58" fill="#26312B" />
      <text x="280" y="184" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="#AAC9B6" fontWeight="600">
        INFORME
      </text>
      <text x="280" y="200" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="#AAC9B6" fontWeight="600">
        BCE · CLIMA
      </text>
      {/* nodes perifèrics + etiquetes EXTERIORS — ink-deep per contrast màxim */}
      {nodes.map((n) => (
        <g key={n.nom} fontFamily="var(--font-mono)" fontSize="11" fontWeight="600">
          <circle cx={n.x} cy={n.y} r="7" fill={n.c} />
          <text x={n.x + n.dx} y={n.y + n.dy} fill="#141B18" textAnchor={n.anchor}>
            {n.nom}
          </text>
          <text x={n.x + n.dx} y={n.y + n.dy + 15} fill="#3D5147" fontWeight={400} fontSize="9.5" textAnchor={n.anchor}>
            {n.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}
