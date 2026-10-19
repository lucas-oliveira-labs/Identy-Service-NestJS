


export interface RuleProps {
    id?: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}


export default class Rule {
    id?: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;


    constructor(props: RuleProps) {
        this.id = props.id;
        this.name = props.name;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}