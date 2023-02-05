import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Code } from './code';
import { CodeService } from './code.service';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent implements OnInit{

  @ViewChild('codeInput', { read: ElementRef, static: true  }) codeInput: ElementRef;

  @ViewChild(MatSort) sort: MatSort;

  // ngAfterViewInit() {
  //   this.dataSource.sort = this.sort;
  // }

  codes: Code[];
  //dataSource = new MatTableDataSource<Code>(this.codes);
  dataSource: MatTableDataSource<Code>;
  displayedColumns: string[] = ['id', 'value', 'action'];

  i : number;

  codeAdd: string | undefined;
  inputValid: string = '';

  fg = new FormGroup({
    "cd": new FormControl("")
  });

  fgMat : FormGroup;
  
  constructor(@Inject(CodeService) public codeService: CodeService, 
              private renderer: Renderer2,
              private fb: FormBuilder,
              @Inject(DOCUMENT) private _document: Document) { 
        
                this.fgMat = this.fb.group({
                  "cd": new FormControl("")
               });

  }

  ngOnInit() {

    this.fg.reset();

    this.codeService.getAll().subscribe((data: Code[])=>{
      console.log(data);
      this.codes = data;
      const c : Code = {id:0, value : "dummy"};
      this.codes.unshift(c);
      this.dataSource = new MatTableDataSource<Code>(this.codes);
      console.log(this.dataSource);
    });

  }

  codeCreate(){
    let a = this.fg.get('cd')?.value;
    console.log("codeCreate, a=>" + a);
    if(a){
      console.log("codeCreate, create");
        const c : Code = {id:0, value : a}
        
        this.codeService.create(c).subscribe({
          next: (res) => {
            console.log(res);
            //this.submitted = true;
          },
          error: (e) => console.error(e)
        });
    }
  }

  codeDelete(id: any){
    console.log("codeDelete, id=>" + id);
    this.codeService.delete(id).subscribe({
      next: (res) => {
        console.log(res);
        //this.submitted = true;
      },
      error: (e) => console.error(e)
    });
    this.refreshPage();
  }

  codeCreateMat(){
    let a = this.fgMat.get('cd')?.value;
    console.log("codeCreateMat, a=>" + a);
    if(a){
      console.log("codeCreateMat, create");
        const c : Code = {id:0, value : a}
        
        this.codeService.create(c).subscribe({
          next: (res) => {
            console.log(res);
            //this.submitted = true;
          },
          error: (e) => console.error(e)
        });;
    }
    this.refreshPage();
  }


  onKeyDownEvent(evt: any) {
    //46 is delete
     var charCode = (evt.which) ? evt.which : evt.keyCode;
      if(charCode == 110 || charCode == 190 ){
        return true;
      }
      if (charCode != 46 && charCode > 31 
        && (charCode < 48 || charCode > 57))
          return false;

      return true;
  }


  numberLostfocus(evt: any) {
    let a = this.fg.get('cd')?.value;
    const decimalPattern1 = "/^\d+(\.\d+)?$/";
    const decimalPattern2 = "/^(?:\d*\.\d{1,2}|\d+)$/";
    console.log("text inpout=>" + a);
    if(!a){
      console.log('set white');
      this.renderer.setStyle(document.getElementById("codeInput"), 'background-color', 'white');
    
    } else if(a){
      if(a === null || a === ''){
        console.log('set white');
        this.renderer.setStyle(document.getElementById("codeInput"), 'background-color', 'white');
      }
      else if(a.match(/^(?:\d*\.\d{1,2}|\d+)$/)){
        console.log("is decimal");
      } else {
        console.log("not decimal,"+evt.target);
        this.inputValid = 'invalid';
        console.log("111,"+this.codeInput?.nativeElement);
        //this.renderer.setStyle(this.codeInput?.nativeElement, 'background-color', 'red');
        console.log("222,"+document.getElementById("codeInput"));
        this.renderer.setStyle(document.getElementById("codeInput"), 'background-color', 'yellow');
        
      }
    }
  }
    
  
  codeLostfocus($event: FocusEvent) {
      let a = this.fgMat.get('cd')?.value;
      console.log("codeLostfocus input:" + a);
      var duplicate = false;
      this.codes.forEach(code => { if(code.value == a)  duplicate=true; });
      if(duplicate){
        document.getElementById("span-alert")!.innerText = 'Duplicate code ' + a;
        //(document.getElementById("buttonAdd")! as HTMLButtonElement).disabled = true;
        (document.querySelector("#buttonAdd")! as HTMLButtonElement).disabled = true;
      } else{
        document.getElementById("span-alert")!.innerText = '';
        (document.querySelector("#buttonAdd")! as HTMLButtonElement).disabled = false;
      }
  }


  refreshPage() {
    this._document.defaultView?.location.reload();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log("filterValue:" + filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
   
  }
    

}


