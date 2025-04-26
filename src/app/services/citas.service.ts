import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
// Se importan los módulos necesarios para trabajar con SQLite usando Capacitor
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection
} from '@capacitor-community/sqlite';

// Se define la interfaz 'Cita' que representa la estructura de una cita.
// La propiedad 'id' es opcional, mientras que 'frase' y 'autor' son obligatorios.
export interface Cita {
  id?: number;
  frase: string;
  autor: string;
}

// El decorador @Injectable indica que este servicio puede ser inyectado a otros componentes o servicios.
// 'providedIn: root' hace que este servicio sea singleton y esté disponible en toda la aplicación.
@Injectable({
  providedIn: 'root'
})
export class CitasService {
  // Propiedad privada para almacenar la conexión a la base de datos SQLite.
  private db!: SQLiteDBConnection;
  // Bandera para indicar si la base de datos se ha inicializado correctamente.
  private initialized: boolean = false;
  
  // En el constructor se intenta inicializar la base de datos.
  constructor() {
    console.log('[CitasService] Constructor: Inicializando base de datos...');
    this.initDB();
  }

  // Método asíncrono para inicializar la base de datos.
  async initDB() {
    // Se muestra la plataforma actual (web, ios, android, etc.)
    console.log('[initDB] Plataforma:', Capacitor.getPlatform());
    
    // Si la plataforma es "web", se omite la inicialización de SQLite y se usará localStorage como alternativa.
    if (Capacitor.getPlatform() === 'web') {
      console.warn('[initDB] Entorno web: Se omite la inicialización de SQLite. Se usará localStorage como fallback.');
      return;
    }
  
    try {
      // Se crea una conexión SQLite usando el plugin CapacitorSQLite.
      const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
      console.log('[initDB] Creando conexión a la base de datos "citasDB"...');
      // Se crea la conexión a la base de datos 'citasDB'.
      // Los parámetros indican: no es lectura únicamente, sin encriptación, versión 1 y sin habilitar migraciones.
      this.db = await sqlite.createConnection('citasDB', false, 'no-encryption', 1, false);
      console.log('[initDB] Abriendo la conexión a la base de datos...');
      // Se abre la conexión a la base de datos.
      await this.db.open();
      console.log('[initDB] Conexión abierta, creando la tabla "citas" si no existe...');
      // Se ejecuta una consulta SQL para crear la tabla "citas" si no existe aún.
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS citas (
          id INTEGER PRIMARY KEY NOT NULL,
          frase TEXT NOT NULL,
          autor TEXT NOT NULL
        );
      `);
      console.log('[initDB] Base de datos conectada y tabla "citas" lista.');
      // Se marca la inicialización como exitosa.
      this.initialized = true;
    } catch (e) {
      // Se captura cualquier error durante la inicialización y se imprime en consola.
      console.error('[initDB] Error al inicializar la base de datos:', e);
    }
  }
  
  // Método para obtener todas las citas almacenadas.
  async obtenerCitas(): Promise<Cita[]> {
    console.log('[obtenerCitas] Llamado al método obtenerCitas.');
    
    // En el entorno web, se utiliza localStorage como fallback.
    if (Capacitor.getPlatform() === 'web') {
      console.warn('[obtenerCitas] Entorno web: leyendo citas de localStorage');
      const citasLS = localStorage.getItem('citas');
      // Si hay datos en localStorage, se parsean a un arreglo de Cita; de lo contrario se devuelve un arreglo vacío.
      const citas: Cita[] = citasLS ? JSON.parse(citasLS) : [];
      console.log('[obtenerCitas] Citas obtenidas de localStorage:', citas);
      return citas;
    }
    
    // Para dispositivos nativos:
    // Se verifica que la base de datos esté inicializada. En caso contrario, se llama a initDB().
    if (!this.initialized) {
      console.log('[obtenerCitas] Base de datos no inicializada, llamando a initDB()...');
      await this.initDB();
    }
    // Si la base de datos no existe aún, se lanza un error.
    if (!this.db) {
      throw new Error('[obtenerCitas] La base de datos no está inicializada.');
    }

    // Se ejecuta la consulta SQL para obtener todas las citas.
    console.log('[obtenerCitas] Ejecutando query: "SELECT * FROM citas".');
    const ret = await this.db.query("SELECT * FROM citas");
    console.log('[obtenerCitas] Citas obtenidas:', ret.values);
    // Se devuelve el resultado convertido al tipo 'Cita[]'.
    return ret.values as Cita[];
  }
  
  // Método para agregar una nueva cita.
  async agregarCita(frase: string, autor: string): Promise<void> {
    console.log(`[agregarCita] Insertando nueva cita: frase="${frase}", autor="${autor}".`);
    
    // En entornos web, se utiliza localStorage para almacenar las citas.
    if (Capacitor.getPlatform() === 'web') {
      console.warn('[agregarCita] Entorno web: agregando cita a localStorage');
      const citasLS = localStorage.getItem('citas');
      let citas: Cita[] = citasLS ? JSON.parse(citasLS) : [];
      // Se genera un ID incremental simple basado en la cita con el mayor ID existente.
      const id = citas.length > 0 ? Math.max(...citas.map(c => c.id || 0)) + 1 : 1;
      citas.push({ id, frase, autor });
      localStorage.setItem('citas', JSON.stringify(citas));
      console.log('[agregarCita] Cita agregada a localStorage:', { id, frase, autor });
      return;
    }
    
    // Para dispositivos nativos:
    if (!this.initialized) {
      console.log('[agregarCita] Base de datos no inicializada, llamando a initDB()...');
      await this.initDB();
    }
    if (!this.db) {
      throw new Error('[agregarCita] La base de datos no está inicializada.');
    }
    // Se inserta la nueva cita en la tabla "citas" usando parámetros para evitar inyección SQL.
    await this.db.run("INSERT INTO citas (frase, autor) VALUES (?, ?);", [frase, autor]);
    console.log('[agregarCita] Cita insertada correctamente en SQLite.');
  }
  
  // Método para eliminar una cita a partir de su ID.
  async eliminarCitaPorId(id: number): Promise<void> {
    console.log(`[eliminarCitaPorId] Eliminando cita con id: ${id}.`);
    
    // En el entorno web, se elimina la cita usando localStorage.
    if (Capacitor.getPlatform() === 'web') {
      console.warn('[eliminarCitaPorId] Entorno web: eliminando cita desde localStorage');
      const citasLS = localStorage.getItem('citas');
      let citas: Cita[] = citasLS ? JSON.parse(citasLS) : [];
      // Se filtra el arreglo para eliminar la cita cuyo id coincida.
      citas = citas.filter(c => c.id !== id);
      localStorage.setItem('citas', JSON.stringify(citas));
      console.log(`[eliminarCitaPorId] Cita con id ${id} eliminada de localStorage.`);
      return;
    }
    
    // Para dispositivos nativos:
    if (!this.initialized) {
      console.log('[eliminarCitaPorId] Base de datos no inicializada, llamando a initDB()...');
      await this.initDB();
    }
    if (!this.db) {
      throw new Error('[eliminarCitaPorId] La base de datos no está inicializada.');
    }
    
    // Se elimina la cita de la tabla "citas" usando su id.
    await this.db.run("DELETE FROM citas WHERE id = ?;", [id]);
    console.log(`[eliminarCitaPorId] Cita con id ${id} eliminada correctamente de SQLite.`);
  }
  
  // Método que elimina una cita recibiendo un objeto Cita.
  async eliminarCita(cita: Cita): Promise<void> {
    // Se verifica que la cita tenga un id definido.
    if (cita.id != null) {
      console.log(`[eliminarCita] Se eliminará la cita: ${JSON.stringify(cita)}.`);
      // Se llama al método eliminarCitaPorId para realizar la eliminación.
      await this.eliminarCitaPorId(cita.id);
    } else {
      console.warn('[eliminarCita] La cita no tiene id, no se puede eliminar.');
    }
  }
  
  // Método genérico para ejecutar consultas SQL personalizadas en entornos nativos.
  async ejecutarConsulta(query: string, params: any[] = []): Promise<any> {
    console.log(`[ejecutarConsulta] Ejecutando consulta: ${query} con parámetros:`, params);
    
    // Si se ejecuta en el entorno web, se omite la consulta en SQLite.
    if (Capacitor.getPlatform() === 'web') {
      console.warn('[ejecutarConsulta] Entorno web: no se ejecuta consulta en SQLite.');
      return null;
    }
    
    // Verifica la inicialización de la base de datos.
    if (!this.initialized) {
      console.log('[ejecutarConsulta] Base de datos no inicializada, llamando a initDB()...');
      await this.initDB();
    }
    if (!this.db) {
      throw new Error('[ejecutarConsulta] La base de datos no está inicializada.');
    }
    
    // Se ejecuta la consulta SQL con los parámetros proporcionados.
    const result = await this.db.query(query, params);
    console.log('[ejecutarConsulta] Resultado de la consulta:', result.values);
    // Se retorna el resultado de la consulta.
    return result.values;
  }
}
