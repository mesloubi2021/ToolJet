import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App } from '../../entities/app.entity';
import { File } from '../../entities/file.entity';
import { AppsController } from '../../controllers/apps.controller';
import { AppsControllerV2 } from '../../controllers/apps.controller.v2';
import { AppsService } from '../../services/apps.service';
import { AppVersion } from '../../../src/entities/app_version.entity';
import { DataQuery } from '../../../src/entities/data_query.entity';
import { CaslModule } from '../casl/casl.module';
import { AppUser } from 'src/entities/app_user.entity';
import { AppUsersService } from '@services/app_users.service';
import { AppUsersController } from '@controllers/app_users.controller';
import { OrganizationUser } from 'src/entities/organization_user.entity';
import { UsersService } from '@services/users.service';
import { User } from 'src/entities/user.entity';
import { Organization } from 'src/entities/organization.entity';
import { FilesService } from '@services/files.service';
import { FoldersService } from '@services/folders.service';
import { Folder } from 'src/entities/folder.entity';
import { FolderApp } from 'src/entities/folder_app.entity';
import { DataSource } from 'src/entities/data_source.entity';
import { AppImportExportService } from '@services/app_import_export.service';
import { DataSourcesService } from '@services/data_sources.service';
import { CredentialsService } from '@services/credentials.service';
import { EncryptionService } from '@services/encryption.service';
import { Credential } from 'src/entities/credential.entity';
import { AppsImportExportController } from '@controllers/app_import_export.controller';
import { PluginsService } from '@services/plugins.service';
import { Plugin } from 'src/entities/plugin.entity';
import { PluginsHelper } from 'src/helpers/plugins.helper';
import { AppEnvironmentService } from '@services/app_environments.service';

import { Component } from 'src/entities/component.entity';
import { Page } from 'src/entities/page.entity';
import { EventHandler } from 'src/entities/event_handler.entity';
import { Layout } from 'src/entities/layout.entity';

import { ComponentsService } from '@services/components.service';
import { PageService } from '@services/page.service';
import { PageHelperService } from '@apps/services/pages/service.helper';
import { EventsService } from '@services/events_handler.service';
import { TooljetDbModule } from '../tooljet_db/tooljet_db.module';
import { UserResourcePermissionsModule } from '@modules/user_resource_permissions/user_resource_permissions.module';
import { AppsSubscriber } from 'src/entity-subscribers/apps.subscriber';
import { AppsServiceSep } from '@apps/services/apps.service.sep';

@Module({
  imports: [
    UserResourcePermissionsModule,
    TypeOrmModule.forFeature([
      App,
      AppVersion,
      AppUser,
      DataQuery,
      Folder,
      FolderApp,
      OrganizationUser,
      User,
      Organization,
      DataSource,
      Credential,
      File,
      Plugin,
      Component,
      Page,
      EventHandler,
      Layout,
    ]),
    TooljetDbModule,
    CaslModule,
  ],
  providers: [
    AppsService,
    AppsServiceSep,
    AppUsersService,
    UsersService,
    FoldersService,
    AppImportExportService,
    DataSourcesService,
    CredentialsService,
    EncryptionService,
    FilesService,
    PluginsService,
    PluginsHelper,
    AppEnvironmentService,
    ComponentsService,
    PageService,
    EventsService,
    AppsSubscriber,
    PageHelperService,
  ],
  controllers: [AppsController, AppsControllerV2, AppUsersController, AppsImportExportController],
})
export class AppsModule {}
