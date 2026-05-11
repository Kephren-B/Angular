import { TestBed } from "@angular/core/testing";
import type { ComponentFixture } from "@angular/core/testing";

import { Profil } from "./profil";

describe("Profil", () => {
	let component: Profil;
	let fixture: ComponentFixture<Profil>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Profil],
		}).compileComponents();

		fixture = TestBed.createComponent(Profil);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should render the profile name", () => {
		const compiled = fixture.nativeElement as HTMLElement;
		expect(compiled.querySelector("h2")?.textContent).toContain("Mouad");
	});
});
