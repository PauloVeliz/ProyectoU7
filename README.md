# Projecto Unidad 7

Proyecto creación API REST con NodeJs, Express, Prisma, Typescript, SQLite"

## Configuración Local

1. Elegir directorio de trabajo.

2. Clonar repositorio en directorio de trabajo:
```bash
    git clone https://github.com/PauloVeliz/ProyectoU7
```

3. Ingresar a `ProyectoU7`

4. Instalar dependencias:
```bash
    npm install
```
5. Hacer migraciones:
```bash
    npm run migrate
```

6. Ejecutar servidor:
```bash
    npm run dev
```

## API REST

### Crear usuario => (POST)
```bash
    /api/v1/users
```
#### Requerimiento Key-value
```bash
{
  "name": "Usuario",
  "email": "email@gmail.com",
  "password": "123456"
  "date_born": "2018-05-20"
}
```
### Login del usuario => (POST)
```bash
    /api/v1/users/login
```

#### Requerimiento Key-value
```bash
{
  "email": "email@gmail.com",
  "password": "123456"
}
```

### Listar usuarios => (GET)
```bash
    /api/v1/users
```

### Listar un usuario => (GET)
```bash
    /api/v1/users/:id
```

### Creación de canción => (POST)
```bash
    /api/v1/songs
```

#### Requerimiento Key-value
```bash
{
  "name": "Canción",
  "artist": "Artista",
  "album": "Album",
  "year": 2023,
  "genre": "Genero",
  "duration": 180,
  "access": true
}

access:     true => Privada     false => Pública
```

### Listar canciones => (GET)
```bash
    /api/v1/songs

    Header Required: Authorization
    Autenticar para listar todas las canciones (Incluye: privadas).
```

### Listar una canción => (GET)
```bash
    /api/v1/songs/:id

    Header Required: Authorization
    Autenticar para listar si la canción es privada.
```

### Creación de playlist => (POST)
```bash
    /api/v1/playlist
```

#### Requerimiento Key-value
```bash
{
  "name": "Playlist",
  "user_id": 1,
  "songs": [{
        "name": "Canción",
        "artist": "Artista",
        "album": "Album",
        "year": 2023,
        "genre": "Género",
        "duration": 180,
        "access": false
    }]
}

access:     true => Privada     false => Pública
```

### Añadir una canción a un playlist => (POST)
```bash
    /api/v1/playlist/add-song
```

#### Requerimiento Key-value
```bash
{
  "id_song": 1,
  "id_playlist": 1
}
```

### Listar playlists => (GET)
```bash
    /api/v1/playlist
```

### Listar un playlist => (GET)
```bash
    /api/v1/playlist/:id
```