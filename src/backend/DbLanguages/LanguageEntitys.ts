import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class De {
    @PrimaryColumn("int")
    id!: number
    @Column("text")
    content!: string
}

@Entity()
export class En {
    @PrimaryColumn("int")
    id!: number
    @Column("text")
    content!: string
}
