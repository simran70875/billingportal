import { createGlobalStyle } from "styled-components";
import * as theme from "./Theme.styled";

export const GlobalStyles = createGlobalStyle`
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  
}

body {
  background-color:  ${({ theme }) => theme.colors.background} !important;
  // color: ${({ theme }) => theme.colors.text} !important;
  font-family: monospace !important;
  overflow-x: hidden !important;
}

.light {
  background-color: ${theme.light.colors.sidebar};
}


// active theme
.active{
  background:${({ theme }) => theme.colors.header};
  border-radius:10px;
    }
    .ag-input-field-input{
      color:#000 !important;
    }
    .ag-theme-quartz {
      --ag-foreground-color: #000;
      --ag-background-color: #fff;
      --ag-header-foreground-color: #fff;
      --ag-header-background-color:rgb(29 126 210) ;
      --ag-odd-row-background-color: rgb(0, 0, 0, 0.03);
      --ag-header-column-resize-handle-color: rgb(126, 46, 132);
  --ag-max-height:400px;
      --ag-font-size: 16px;
      --ag-font-family: monospace;
  }
  .btsia{
    transition:all 0.6s ;
    margin-left:8px
  }
  .btsi:hover .btsia{
margin-left:12px!important
  }
  .ag-root-wrapper-body.ag-focus-managed.ag-layout-normal{
    height:auto !Important;
  }
  .ag-root-wrapper.ag-ltr.ag-layout-normal{
    height:auto !Important;
  }
  .ag-root.ag-unselectable.ag-layout-normal{
    height:fit-content !important;
  }

  .mytable.ag-theme-quartz {
    --ag-header-background-color: #5d8322 ;
  }
  .myhead.modal-header .btn-close{
    color:#fff !important;
  }


`;
