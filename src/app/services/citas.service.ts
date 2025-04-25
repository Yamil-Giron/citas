import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection
} from '@capacitor-community/sqlite';

export interface Cita {
  id?: number;
  frase: string;
  autor: string;
}

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private db!: SQLiteDBConnection;
  private initialized: boolean = false;
  
  constructor() {
    this.initDB();
  }

  async initDB() {
    try {
      const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
      // Creamos (o conectamos) a la base de datos "citasDB"
      this.db = await sqlite.createConnection('citasDB', false, 'no-encryption', 1, false);
      await this.db.open();
      // Creamos la tabla si no existe.
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS citas (
          id INTEGER PRIMARY KEY NOT NULL,
          frase TEXT NOT NULL,
          autor TEXT NOT NULL
        );
      `);
      this.initialized = true;
    } catch (e) {
      console.error('Error al iniciar la DB', e);
    }
  }

  // Retorna todas las citas
  async obtenerCitas(): Promise<Cita[]> {
    if (!this.initialized) {
      await this.initDB();
    }
    const ret = await this.db.query("SELECT * FROM citas");
    return ret.values as Cita[];
  }

  // Agrega una nueva cita a la DB
  async agregarCita(frase: string, autor: string): Promise<void> {
    if (!this.initialized) {
      await this.initDB();
    }
    await this.db.run("INSERT INTO citas (frase, autor) VALUES (?, ?);", [frase, autor]);
  }

  // Elimina una cita por su id
  async eliminarCitaPorId(id: number): Promise<void> {
    if (!this.initialized) {
      await this.initDB();
    }
    await this.db.run("DELETE FROM citas WHERE id = ?;", [id]);
  }

  // Método para eliminar una cita pasado el objeto (opcional, para uso en inicio)
  async eliminarCita(cita: Cita): Promise<void> {
    if (cita.id != null) {
      await this.eliminarCitaPorId(cita.id);
    }
  }
}
