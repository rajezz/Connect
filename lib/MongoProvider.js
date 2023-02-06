class MongoProvider {
	constructor(model) {
		this.model = model;
	}
	async findAll() {
		try {
			const doc = await this.model.findAll();
			return [null, doc];
		} catch (error) {
			return [error];
		}
	}
	async findById(query) {
		try {
			const doc = await this.model.findOne(query);
			return [null, doc];
		} catch (error) {
			return [error];
		}
	}
	async findOne(query) {
		try {
			const doc = await this.model.findOne(query);
			return [null, doc];
		} catch (error) {
			return [error];
		}
	}
	async save(doc) {
		try {
			const result = await this.model.create(doc);
			return [null, result];
		} catch (error) {
			return [error];
		}
	}
	async updateOne(query, doc) {
		try {
			const result = await this.model.updateOne(query, doc);
			return [null, result];
		} catch (error) {
			return [error];
		}
	}
}

module.exports = { MongoProvider };
