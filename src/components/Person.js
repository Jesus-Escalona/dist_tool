import faker from 'faker'

export default class Person {
    constructor(activity, sector, gender, position) {
        this.activity = activity;
        this.sector = sector;
        this.gender = gender;
        this.position = position;
        this.table = null;
        this.name = faker.name.firstName(gender);
    }

    assignTable(tableNumber) {
        this.table = tableNumber;
    }
}
