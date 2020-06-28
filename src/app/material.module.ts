import { NgModule } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatBadgeModule } from '@angular/material/badge';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
    imports: [MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
       MatSnackBarModule,
        MatButtonToggleModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatTooltipModule,
        MatMenuModule,
        MatDialogModule,
        ImageCropperModule,
        MatBadgeModule,
        MatExpansionModule],

    exports: [MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
       MatCardModule,
        MatButtonModule,
      MatSnackBarModule,
        MatButtonToggleModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatTooltipModule,
        MatMenuModule,
        MatDialogModule,
        ImageCropperModule,
        MatBadgeModule,
        MatExpansionModule]

})

export class MaterialModule { }