import { describe, expect, it, beforeAll, afterAll } from 'bun:test'
import { db, usuario } from '../src/services/index'
import { eq } from 'drizzle-orm'

// Configuración
const BASE_URL = 'http://localhost:8000'
const TEST_USER = {
  nombre: 'testuser',
  clave: 'testpassword123'
}

describe('Ruta POST /nuevo - Pruebas con fetch', () => {
  beforeAll(async () => {
    // Limpiar la base de datos antes de comenzar
    await db.delete(usuario)
  })

  afterAll(async () => {
    // Limpiar la base de datos después de las pruebas
    await db.delete(usuario)
  })

  it('debería crear un nuevo usuario exitosamente', async () => {
    const response = await fetch(`${BASE_URL}/nuevo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(TEST_USER)
    })

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toEqual({ success: true })

    // Verificar en la base de datos
    const [createdUser] = await db
      .select()
      .from(usuario)
      .where(eq(usuario.nombre, TEST_USER.nombre))
      .limit(1)

    expect(createdUser).toBeDefined()
    expect(createdUser.nombre).toBe(TEST_USER.nombre)
    expect(createdUser.clave).not.toBe(TEST_USER.clave)
    expect(await Bun.password.verify(TEST_USER.clave, createdUser.clave)).toBe(true)
  })

  it('debería fallar con status 400 si falta el nombre', async () => {
    const response = await fetch(`${BASE_URL}/nuevo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ clave: 'password123' })
    })

    expect(response.status).toBe(400)
  })

  it('debería fallar con status 400 si falta la contraseña', async () => {
    const response = await fetch(`${BASE_URL}/nuevo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre: 'testuser2' })
    })

    expect(response.status).toBe(400)
  })

  it('debería manejar correctamente usuarios duplicados', async () => {
    // Primera creación (debería funcionar)
    const firstResponse = await fetch(`${BASE_URL}/nuevo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(TEST_USER)
    })
    expect(firstResponse.status).toBe(200)

    // Segunda creación con mismo nombre (debería fallar)
    const secondResponse = await fetch(`${BASE_URL}/nuevo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(TEST_USER)
    })

    expect(secondResponse.status).toBe(200) // Tu endpoint actual devuelve 200
    const body = await secondResponse.json()
    expect(body).toEqual({ success: false })
  })

  it('debería recortar espacios en blanco en nombre y contraseña', async () => {
    const userWithSpaces = {
      nombre: '  userwithspaces  ',
      clave: '  passwordwithspaces  '
    }

    const response = await fetch(`${BASE_URL}/nuevo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userWithSpaces)
    })

    expect(response.status).toBe(200)

    // Verificar en la base de datos que los valores fueron recortados
    const [createdUser] = await db
      .select()
      .from(usuario)
      .where(eq(usuario.nombre, userWithSpaces.nombre.trim()))
      .limit(1)

    expect(createdUser).toBeDefined()
    expect(createdUser.nombre).toBe(userWithSpaces.nombre.trim())
    expect(await Bun.password.verify(userWithSpaces.clave.trim(), createdUser.clave)).toBe(true)
  })
})