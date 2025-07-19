import React, { useState, useEffect } from 'react';

// Estructura de materias personalizadas ejemplo
const subjects = [
  // OBLIGATORIAS
  {
    id: 'conceptos-contables',
    name: 'Conceptos contables',
    semester: 1,
    credits: 10,
    area: 'Contabilidad e impuestos',
    type: 'Obligatoria',
    prerequisites: [],
  },
  {
    id: 'adm-gestion-org1',
    name: 'Administración y Gestión de las organizaciones 1',
    semester: 1,
    credits: 10,
    area: 'Administración',
    type: 'Obligatoria',
    prerequisites: [],
  },
  {
    id: 'microeconomia',
    name: 'Introducción a la microeconomía',
    semester: 1,
    credits: 10,
    area: 'Economía',
    type: 'Obligatoria',
    prerequisites: [],
  },
  {
    id: 'calculo1',
    name: 'Calculo 1',
    semester: 1,
    credits: 10,
    area: 'Métodos cuantitativos',
    type: 'Obligatoria',
    prerequisites: [],
  },
  {
    id: 'contab-gral1',
    name: 'Contabilidad General 1',
    semester: 2,
    credits: 10,
    area: 'Contabilidad e impuestos',
    type: 'Obligatoria',
    prerequisites: ['conceptos-contables'],
  },
  {
    id: 'derecho-civil',
    name: 'Derecho Civil',
    semester: 2,
    credits: 10,
    area: 'Jurídica',
    type: 'Obligatoria',
    prerequisites: [],
  },
  {
    id: 'economia-descriptiva',
    name: 'Economía descriptiva',
    semester: 2,
    credits: 10,
    area: 'Economía',
    type: 'Obligatoria',
    prerequisites: [],
  },
  {
    id: 'estadistica',
    name: 'Introducción a la estadística',
    semester: 3,
    credits: 10,
    area: 'Economía',
    type: 'Obligatoria',
    prerequisites: ['calculo1'],
  },
  {
    id: 'contab-gral2',
    name: 'Contabilidad General 2',
    semester: 3,
    credits: 10,
    area: 'Contabilidad e impuestos',
    type: 'Obligatoria',
    prerequisites: ['contab-gral1'],
  },
  {
    id: 'derecho-comercial',
    name: 'Derecho Comercial',
    semester: 3,
    credits: 10,
    area: 'Jurídica',
    type: 'Obligatoria',
    prerequisites: ['derecho-civil'],
  },
  {
    id: 'procesos-sistemas-info',
    name: 'Procesos y Sistemas de información',
    semester: 3,
    credits: 10,
    area: 'Administración',
    type: 'Obligatoria',
    prerequisites: ['adm-gestion-org1'],
  },
  // ... Continua agregando las materias obligatorias con sus requisitos

  // OPCIONALES
  {
    id: 'adm-gestion-org2',
    name: 'Administración y Gestión de las organizaciones 2',
    semester: 2,
    credits: 10,
    area: 'Administración',
    type: 'Opcional',
    prerequisites: ['adm-gestion-org1'],
  },
  {
    id: 'ciencia-politica',
    name: 'Ciencia Política',
    semester: 2,
    credits: 10,
    area: 'CIENCIAS SOCIALES Y HUMANÍSTICAS',
    type: 'Opcional',
    prerequisites: [],
  },
  // ... Continua agregando las opcionales con sus requisitos
];

// Función para calcular créditos por área y total
function getCredits(state) {
  // Agrupa los créditos por área y total
  let total = 0;
  const areas = {};
  subjects.forEach((subj) => {
    if (state[subj.id]) {
      total += subj.credits;
      if (!areas[subj.area]) areas[subj.area] = 0;
      areas[subj.area] += subj.credits;
    }
  });
  return { total, areas };
}

const STORAGE_KEY = 'career_progress_personalizada';

function CareerGridPersonalized() {
  const [completed, setCompleted] = useState({});
  const [filterType, setFilterType] = useState('Todas');

  // Cargar progreso al iniciar
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) setCompleted(JSON.parse(savedProgress));
  }, []);

  // Guardar progreso al cambiar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  // Agrupa materias por área
  const areas = Array.from(
    new Set(subjects.map((subj) => subj.area))
  );

  // Cálculo de créditos
  const credits = getCredits(completed);

  // Verifica desbloqueo de materia
  function isUnlocked(subject) {
    // Requisitos por materias
    const reqMaterias = subject.prerequisites.every((id) => completed[id]);
    // Requisitos adicionales por créditos de área
    // Ejemplo: "10 créditos en el área jurídica" => puedes personalizarlo agregando un campo extra en el objeto
    // Si tienes requisitos por créditos, deberías agregarlos en el objeto y verificar aquí
    return reqMaterias; // Puedes expandir con más lógica de créditos si lo deseas
  }

  // Maneja click en materia
  function handleClick(id) {
    setCompleted((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  // Filtra materias por tipo
  const filteredSubjects = filterType === 'Todas'
    ? subjects
    : subjects.filter((s) => s.type === filterType);

  return (
    <div>
      <h2>Malla Interactiva de la Carrera</h2>
      <div>
        <label>Filtrar por tipo: </label>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="Todas">Todas</option>
          <option value="Obligatoria">Obligatorias</option>
          <option value="Opcional">Opcionales</option>
        </select>
      </div>
      <div>
        <strong>Créditos totales aprobados:</strong> {credits.total}
        <br />
        {Object.entries(credits.areas).map(([area, cred]) => (
          <span key={area}><strong>{area}:</strong> {cred} &nbsp;</span>
        ))}
      </div>
      {areas.map(area => (
        <div key={area} style={{ margin: "30px 0" }}>
          <h3>{area}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
            {filteredSubjects.filter(s => s.area === area).map(subject => (
              <button
                key={subject.id}
                onClick={() => isUnlocked(subject) && handleClick(subject.id)}
                disabled={!isUnlocked(subject)}
                style={{
                  textDecoration: completed[subject.id] ? 'line-through' : 'none',
                  background: isUnlocked(subject) ? '#e0ffe0' : '#ffe0e0',
                  cursor: isUnlocked(subject) ? 'pointer' : 'not-allowed',
                  minWidth: '180px',
                  padding: '12px',
                  border: '1px solid #aaa',
                  borderRadius: '8px',
                  opacity: subject.type === 'Opcional' ? 0.8 : 1,
                }}
                title={`Semestre: ${subject.semester}\nCréditos: ${subject.credits}\nRequisitos: ${subject.prerequisites.length ? subject.prerequisites.map(id => subjects.find(s => s.id === id)?.name).join(', ') : 'Ninguno'}`}
              >
                <b>{subject.name}</b><br />
                <small>Sem: {subject.semester} | Créditos: {subject.credits}</small>
                <br />
                {subject.type === 'Opcional' && <span style={{ color: "#444" }}>(Opcional)</span>}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div style={{ marginTop: 30 }}>
        <button onClick={() => { setCompleted({}); localStorage.removeItem(STORAGE_KEY); }}>Reiniciar progreso</button>
      </div>
    </div>
  );
}

export default CareerGridPersonalized;
