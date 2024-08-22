import { Injectable } from '@angular/core';
import { App, Credentials } from 'realm-web';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecordsService {
  private app: App;

  constructor() {
    this.app = new App({ id: 'application-0-nrleuwy' });
  }

  async getRecords(collectionName: string): Promise<any[]> {
    const credentials = Credentials.anonymous();
    try {
      const user = await this.app.logIn(credentials);
      const mongo = user.mongoClient('mongodb-atlas');
      const collection = mongo.db('recordsDB').collection(collectionName);
      return await collection.find();
    } catch (error) {
      console.error('Failed to fetch records:', error);
      throw error;
    }
  }

  async addRecord(collectionName: string, record: any): Promise<void> {
    const credentials = Credentials.anonymous();
    try {
      const user = await this.app.logIn(credentials);
      const mongo = user.mongoClient('mongodb-atlas');
      const collection = mongo.db('recordsDB').collection(collectionName);
      await collection.insertOne(record);
    } catch (error) {
      console.error('Failed to add record:', error);
      throw error;
    }
  }

  async addRecords(collectionName: string, records: any[]): Promise<void> {
    return Promise.all(records.map((record) => this.addRecord(collectionName, record)))
      .then(() => {
        console.log('All records added successfully');
      })
      .catch((error) => {
        console.error('Failed to add records:', error);
        throw error;
      });
    
  }

  async updateRecord(collectionName: string, record: any): Promise<void> {
    const credentials = Credentials.anonymous();
    try {
      const user = await this.app.logIn(credentials);
      const mongo = user.mongoClient('mongodb-atlas');
      const collection = mongo.db('recordsDB').collection(collectionName);
      await collection.updateOne({ _id: record._id }, record);
    } catch (error) {
      console.error('Failed to update record:', error);
      throw error;
    }
  }

  async deleteRecord(collectionName: string, recordId: string): Promise<void> {
    const credentials = Credentials.anonymous();
    try {
      const user = await this.app.logIn(credentials);
      const mongo = user.mongoClient('mongodb-atlas');
      const collection = mongo.db('recordsDB').collection(collectionName);
      await collection.deleteOne({ _id: recordId });
    } catch (error) {
      console.error('Failed to delete record:', error);
      throw error;
    }
  }
}

