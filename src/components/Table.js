export default class Table {
    constructor(people = []) {
        this.seats = people.length
        this.people = people
    }

    addPerson(person) {
        this.people.push(person)
        this.seats++
    }

    getDiversityScore() {

    }

}
