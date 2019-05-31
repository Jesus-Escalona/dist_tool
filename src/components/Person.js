import faker from 'faker'

export default class Person {
    constructor(activity, sector, gender) {
        this.activity = activity;
        this.sector = sector;
        this.gender = gender;
        console.log(gender);
        this.name = faker.name.firstName(gender);
    }
}
