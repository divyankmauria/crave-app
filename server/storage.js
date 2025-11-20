// Storage is not needed for this application as we fetch data directly from Yelp API

export class MemStorage {
  constructor() {}
}

export const storage = new MemStorage();
