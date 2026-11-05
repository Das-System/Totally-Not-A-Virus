import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class de(){
    @PrimaryColumn()
    id = int
    @Column
    content = string
}

@Entity()
export class en(){
    @PrimaryColumn("int")
    id = int
    @Column("text")
    content = string
}
