import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VenuesService } from '../venues.service';
import { Venue, Item, ItemVisit, ItemNameAndVisitsPerItem, AllVisits, ItemNameAndVisitPerItem } from '../../../shared/models';
import { ItemsService } from '../items/items.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable, filter, map, take } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {


    itemNameAndVisitsPerItems: ItemNameAndVisitsPerItem[] = []

    panelOpenState: boolean = false;
    venue: Venue;

    start: number;
    end: number;
    // range = new FormGroup({
    //     start: new FormControl(null),
    //     end: new FormControl(null),
    // });
    selectionInProgress: boolean = false;
    max;
    form: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private venuesService: VenuesService,
        private itemsService: ItemsService,
        public authService: AuthService,
        private router: Router,
        private fb: FormBuilder

    ) { }
    ngOnInit(): void {
        this.initForm()
        this.max = new Date()
        // console.log(this.max)
        this.route.params.subscribe((params: any) => {
            if (!params) {
                alert('no params, no venue id')
                this.router.navigateByUrl('/admin/venues');
            } else {
                const venueId = params.venueId;
                this.venuesService.getVenueById(venueId).subscribe((venue: Venue) => {
                    this.venue = venue;
                })
            }
        })
    }
    initForm() {
        this.form = this.fb.group({
            start: new FormControl(null),
            end: new FormControl(null)
        })
    }
    onDateChangeStart(e) {
        console.log(this.itemNameAndVisitsPerItems)
        this.itemNameAndVisitsPerItems = [];
        console.log(this.itemNameAndVisitsPerItems)
        this.end = null;
        this.clear();
    }

    onDateChangeComplete(e) {
        // console.log(this.form.value.start);
        this.selectionInProgress = true;
        if (!e.value) {
            console.log('no dates selected')
            // this.end = undefined;
        } else {
            console.log('dates selected')
            this.start = new Date(this.form.value.start).getTime();
            // add (86400000 - 1) to get the end of the selected day, otherwise 'end' starts at the beginning of the selected day
            this.end = new Date(this.form.value.end).getTime() + (86400000 - 1);
            this.getItemVisits();
        }
    }

    getItemVisits() {
        console.log('getItemVisits()');
        this.itemNameAndVisitsPerItems = []
        this.selectionInProgress = false;
        this.itemsService.getItems(this.venue.id).subscribe((items: Item[]) => {
            items.forEach((item: Item) => {
                this.itemNameAndVisitsPerItems.push({ itemName: item.name, itemVisits: [] })

                this.sortItemVisitsByItemIdAddLikes(this.venue.id, item.id, item.name)

                // console.log(this.itemNameAndVisitsPerItems)
            })
        })
    }

    sortItemVisitsByItemIdAddLikes(venueId: string, itemId: string, itemName: string) {
        console.log('sorting')
        const index = this.itemNameAndVisitsPerItems.findIndex((itemNameAndVisitPerItem: any) => {
            return itemNameAndVisitPerItem.itemName == itemName;
        });
        this.itemNameAndVisitsPerItems[index].itemVisits = []
        const subscription = this.venuesService.getVisits(
            venueId,
            itemId,
            this.start,
            this.end)
            .subscribe((itemVisits: ItemVisit[]) => {
                let likesCount = 0
                itemVisits.forEach((itemVisit: ItemVisit) => {
                    if (itemVisit.liked) {
                        likesCount = likesCount + 1;
                    }
                    this.itemNameAndVisitsPerItems[index].likes = likesCount;
                    console.log('push')

                    this.itemNameAndVisitsPerItems[index].itemVisits.push({
                        timestamp: itemVisit.timestamp,
                        liked: itemVisit.liked,
                        id: itemVisit.id
                    })
                })
                this.itemNameAndVisitsPerItems = this.sortItemNameAndVisitsPerItemByDate(this.itemNameAndVisitsPerItems);
                subscription.unsubscribe();
            })
    }

    sortItemNameAndVisitsPerItemByDate(itemNameAndVisitsPerItems: ItemNameAndVisitsPerItem[]) {
        itemNameAndVisitsPerItems.forEach((itemNameAndVisitPerItem) => {
            itemNameAndVisitPerItem.itemVisits.sort((a, b) => {
                return a.timestamp - b.timestamp
            })
        })
        return itemNameAndVisitsPerItems
    }


    clear() {
        console.log('clear()')
        this.itemNameAndVisitsPerItems = [];
    }
}
