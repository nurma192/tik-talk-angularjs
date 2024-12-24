import {Component, inject} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {ProfileService} from "../../data/services/profile.service";
import {Profile} from "../../data/interfaces/profile.interface";

@Component({
  selector: 'app-layout',
  standalone: true,
    imports: [
        RouterOutlet,
        SidebarComponent
    ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
    profileService = inject(ProfileService)
    user: Profile | null = null

    ngOnInit() {
        this.profileService.getMe().subscribe(val => {
            this.user = val
        })
    }
}
