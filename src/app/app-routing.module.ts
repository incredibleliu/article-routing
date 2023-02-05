import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleComponent } from './article/article.component';
import { MtableComponent } from './mtable/mtable.component';
import { CodeComponent } from './code/code.component';

const routes: Routes = [
  {  
    path:'**',
    //component: MtableComponent
    component: CodeComponent
  },
  {  
    path:'',
    component: ArticleComponent
  },
  {
    path: 'article',
    component: ArticleComponent,
    children:[
              {
                path:'article/:type', //:type is dynamic here
                component:ArticleComponent
              }
            ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



