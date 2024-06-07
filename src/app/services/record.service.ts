import { Injectable } from '@angular/core';
import { App, Credentials } from 'realm-web';

@Injectable({
  providedIn: 'root',
})
export class RecordsService {
  private app: App;

  constructor() {
    this.app = new App({ id: 'application-0-nrleuwy' });
  }

  async getGuinnessRecords() {
    const credentials = Credentials.anonymous();
    try {
      const user = await this.app.logIn(credentials);
      const mongo = user.mongoClient('mongodb-atlas');
      const collection = mongo.db('recordsDB').collection('guinnessRecords');
      return await collection.find();
    } catch (error) {
      console.error('Failed to fetch records:', error);
      throw error;
    }
  }
}

