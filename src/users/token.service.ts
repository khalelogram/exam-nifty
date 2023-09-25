import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AbstractService } from "src/shared/abstract.service";
import { Token } from "./entities/token.entity";
import { Repository } from 'typeorm';

@Injectable()
export class TokenService extends AbstractService {
    constructor(
        @InjectRepository(Token) protected readonly tokenRepository: Repository<Token>
    ) {
        super(tokenRepository)
    }
}
