import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
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
    console.log('[CitasService] Constructor: Inicializando base de datos...');
    this.initDB();
  }

  async initDB() {
    console.log('[initDB] Plataforma:', Capacitor.getPlatform());
    // En la web usaremos localStorage como fallback
    if (Capacitor.getPlatform() === 'web') {
      console.warn('[initDB] Entorno web: Se omite la inicialización de SQLite. Se usará localStorage como fallback.');
      return;
    }
  
    try {
      const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
      console.log('[initDB] Creando conexión a la base de datos "citasDB"...');
      // El quinto parámetro habilita lectura/escritura
      this.db = await sqlite.createConnection('citasDB', false, 'no-encryption', 1, false);
      console.log('[initDB] Abriendo la conexión a la base de datos...');
      await this.db.open();
      console.log('[initDB] Conexión abierta, creando la tabla "citas" si no existe...');
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS citas (
          id INTEGER PRIMARY KEY NOT NULL,
          frase TEXT NOT NULL,
          autor TEXT NOT NULL
        );
      `);
      console.log('[initDB] Base de datos conectada y tabla "citas" lista.');
      this.initialized = true;
    } catch (e) {
      console.error('[initDB] Error al inicializar la base de datos:', e);
    }
  }
  
  async obtenerCitas(): Promise<Cita[]> {
    console.log('[obtenerCitas] Llamado al método obtenerCitas.');
    if (Capacitor.getPlatform() === 'web') {
      console.warn('[obtenerCitas] Entorno web: leyendo citas de localStorage');
      const citasLS = localStorage.getItem('citas');
      const citas: Cita[] = citasLS ? JSON.parse(citasLS) : [];
      console.log('[obtenerCitas] Citas obtenidas de localStorage:', citas);
      return citas;
    }
    
    // En dispositivos nativos
    if (!this.initialized) {
      console.log('[obtenerCitas] Base de datos no inicializada, llamando a initDB()...');
      await this.initDB();
    }
    if (!this.db) {
      throw new Error('[obtenerCitas] La base de datos no está inicializada.');
    }

    console.log('[obtenerCitas] Ejecutando query: "SELECT * FROM citas".');
    const ret = await this.db.query("SELECT * FROM citas");
    console.log('[obtenerCitas] Citas obtenidas:', ret.values);
    return ret.values as Cita[];
  }
  
  async agregarCita(frase: string, autor: string): Promise<void> {
    console.log(`[agregarCita] Insertando nueva cita: frase="${frase}", autor="${autor}".`);
    if (Capacitor.getPlatform() === 'web') {
      console.warn('[agregarCita] Entorno web: agregando cita a localStorage');
      const citasLS = localStorage.getItem('citas');
      let citas: Cita[] = citasLS ? JSON.parse(citasLS) : [];
      // Genera un id incremental simple
      const id = citas.length > 0 ? Math.max(...citas.map(c => c.id || 0)) + 1 : 1;
      citas.push({ id, frase, autor });
      localStorage.setItem('citas', JSON.stringify(citas));
      console.log('[agregarCita] Cita agregada a localStorage:', { id, frase, autor });
      return;
    }
    
    // En dispositivos nativos
    if (!this.initialized) {
      console.log('[agregarCita] Base de datos no inicializada, llamando a initDB()...');
      await this.initDB();
    }
    if (!this.db) {
      throw new Error('[agregarCita] La base de datos no está inicializada.');
    }
    
    await this.db.run("INSERT INTO citas (frase, autor) VALUES (?, ?);", [frase, autor]);
    console.log('[agregarCita] Cita insertada correctamente en SQLite.');
  }
  
  async eliminarCitaPorId(id: number): Promise<void> {
    console.log(`[eliminarCitaPorId] Eliminando cita con id: ${id}.`);
    if (Capacitor.getPlatform() === 'web') {
      console.warn('[eliminarCitaPorId] Entorno web: eliminando cita desde localStorage');
      const citasLS = localStorage.getItem('citas');
      let citas: Cita[] = citasLS ? JSON.parse(citasLS) : [];
      citas = citas.filter(c => c.id !== id);
      localStorage.setItem('citas', JSON.stringify(citas));
      console.log(`[eliminarCitaPorId] Cita con id ${id} eliminada de localStorage.`);
      return;
    }
    
    // En dispositivos nativos
    if (!this.initialized) {
      console.log('[eliminarCitaPorId] Base de datos no inicializada, llamando a initDB()...');
      await this.initDB();
    }
    if (!this.db) {
      throw new Error('[eliminarCitaPorId] La base de datos no está inicializada.');
    }
    
    await this.db.run("DELETE FROM citas WHERE id = ?;", [id]);
    console.log(`[eliminarCitaPorId] Cita con id ${id} eliminada correctamente de SQLite.`);
  }
  
  async eliminarCita(cita: Cita): Promise<void> {
    if (cita.id != null) {
      console.log(`[eliminarCita] Se eliminará la cita: ${JSON.stringify(cita)}.`);
      await this.eliminarCitaPorId(cita.id);
    } else {
      console.warn('[eliminarCita] La cita no tiene id, no se puede eliminar.');
    }
  }
  
  // Método genérico para ejecutar consultas personalizadas (para entornos nativos)
  async ejecutarConsulta(query: string, params: any[] = []): Promise<any> {
    console.log(`[ejecutarConsulta] Ejecutando consulta: ${query} con parámetros:`, params);
    
    if (Capacitor.getPlatform() === 'web') {
      console.warn('[ejecutarConsulta] Entorno web: no se ejecuta consulta en SQLite.');
      return null;
    }
    
    if (!this.initialized) {
      console.log('[ejecutarConsulta] Base de datos no inicializada, llamando a initDB()...');
      await this.initDB();
    }
    if (!this.db) {
      throw new Error('[ejecutarConsulta] La base de datos no está inicializada.');
    }
    
    const result = await this.db.query(query, params);
    console.log('[ejecutarConsulta] Resultado de la consulta:', result.values);
    return result.values;
  }
}
