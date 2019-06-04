import React, {Component} from 'react';
import Plot from 'react-plotly.js';
import Person from './components/Person'
import Table from './components/Table'

import './App.css';

class App extends Component {

    state = {
        numberOfPeople: 0,
        people: [],
        sortedPeople: [],
        tables: [],
        label: ["A1", "A2", "B1", "B2", "C1", "C2"],
        link: {
            source: [0,1,0,2,3,3],
            target: [2,3,3,4,4,5],
            value:  [8,4,2,8,4,2]
        }
    };

    getNumberOfTables = (seatsPerTable = 8) => {
        const { numberOfPeople } = this.state;
        let numberOfTables = Math.ceil(numberOfPeople / seatsPerTable);
        let remaining = numberOfTables * seatsPerTable - numberOfPeople;

        while (remaining >= seatsPerTable / 2 && seatsPerTable >= 6) {
            seatsPerTable -= 1;
            numberOfTables = Math.ceil(numberOfPeople / seatsPerTable);
            remaining = numberOfTables * seatsPerTable - numberOfPeople
        }

        return numberOfTables
    };

    sortPeople = (people) => {
        return people.sort((a,b) => a.gender - b.gender || a.act - b.act || a.sector - b.sector)
    };

    assignTables = (sortedPeople) => {
        let people = [...sortedPeople];
        let numberOfTables = this.getNumberOfTables();
        let tables = Array(numberOfTables).fill(0).map(() => new Table());
        let i = 0;
        while (people.length) {
            let tableIdx = i % numberOfTables;
            let person = people.pop();
            person.assignTable(tableIdx);
            tables[tableIdx].addPerson(person);
            i++
        }

        return tables
    };

    generatePeople = () => {
        const { numberOfPeople } = this.state;
        let people = Array(numberOfPeople).fill(0).map((el, index) => new Person(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 2), index));
        let sortedPeople = this.sortPeople([...people]);
        let tables = this.assignTables(sortedPeople);

        let label = people.map(person => person.name).concat(sortedPeople.map(person => person.name)).concat(tables.map((e,i) => "Table " + i));

        let source = Array(numberOfPeople).fill(1).map((e,i) => i);
        let target = Array(numberOfPeople).fill(0);
        sortedPeople.forEach((person, index) => target[person.position] = index + numberOfPeople);

        source = source.concat(Array(numberOfPeople).fill(1).map((e,i) => i + numberOfPeople));
        target = target.concat(sortedPeople.map(person => person.table + numberOfPeople*2));


        let link = {
            source,
            target,
            value: Array(2*numberOfPeople).fill(1)
        };

        // link: {
        //     source: [0,1,0,2,3,3],
        //         target: [2,3,3,4,4,5],
        //         value:  [8,4,2,8,4,2]
        // }

        this.setState({label, link, people, sortedPeople, tables});
    };



    render() {
        const { numberOfPeople, label, link } = this.state;
        return (
            <div className="App">
                <h1>Seating Tool Visualization</h1>
                <input value={numberOfPeople || ""} onChange={(e) => this.setState({numberOfPeople: parseInt(e.target.value)})} placeholder="Enter a number"/>
                <button onClick={this.generatePeople}>Assign tables</button>

                <Plot
                    data={[
                        {
                            type: "sankey",
                            orientation: "h",
                            arrangement: "perpendicular",
                            node: {
                                pad: 40,
                                thickness: 40,
                                label,
                                colorscale: "Picnic",
                                y: link.target,
                            },

                            link
                        }
                    ]}
                    layout={ {width: 1000, height: 800, title: 'Even distribution of people', font: {size: 10}} }
                />
            </div>
        )
    }
}

export default App;
