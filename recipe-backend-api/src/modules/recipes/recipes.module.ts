import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { ActivityModule } from '../activity/activity.module';
import { ModerationModule } from '../moderation/moderation.module';

@Module({
  imports: [ActivityModule, ModerationModule],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}