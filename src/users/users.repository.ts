import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { ProviderInfo } from './users.dto';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getUserByProvider(provider: ProviderInfo): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        ...provider,
      },
    });
  }

  async setRefreshToken(userId: string, refreshToken: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { refreshToken: true },
    });
    if (!user) {
      return null;
    }
    return user.refreshToken;
  }
}
