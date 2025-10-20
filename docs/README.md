sequenceDiagram
    autonumber
    participant Usuario
    participant UI as "Frontend (Browser / SPA)"
    participant API as "Backend API"
    participant Cache as "Cache (Redis)"
    participant DB as "Base de datos"
    participant Worker as "Worker / Job Queue"
    participant Notif as "WebSocket / SSE"

    Usuario->>UI: Interacción (clic, envío de formulario)
    UI->>API: Petición HTTP (JSON)
    API->>Cache: Comprobar respuesta en caché
    alt Caché tiene dato
        Cache-->>API: Respuesta cacheada
        API-->>UI: 200 OK (datos cacheados)
    else Caché no tiene dato
        API->>DB: Consulta / Lectura
        DB-->>API: Resultado
        API->>Cache: Guardar respuesta cacheada
        API-->>UI: 200 OK (datos frescos)
    end

    UI->>API: Petición que inicia tarea larga
    API->>Worker: Encolar trabajo (mensaje)
    API-->>UI: 202 Accepted (job_id)
    Worker->>DB: Actualizar estado del trabajo
    Worker->>API: Llamada de vuelta / webhook (opcional)
    API->>Notif: Emitir actualización de estado
    Notif-->>UI: Evento en tiempo real (estado del job)
    UI->>Usuario: Mostrar resultado / progreso