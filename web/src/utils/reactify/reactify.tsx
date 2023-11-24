import { ApplicationRef, ComponentRef, createComponent, Type } from "@angular/core";
import "@angular/compiler"
import 'zone.js';
import { createApplication } from "@angular/platform-browser";

import React, { useEffect, useRef, useState } from "react";

type AnyComponentRef = ComponentRef<unknown>;

export type ReactifyProps = {
  component: Type<unknown>;
  inputs?: Record<string, unknown>;
};

export const Reactify: React.FunctionComponent<ReactifyProps> = (props) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [appRef, setAppRef] = useState<ApplicationRef | null>(null);
  const [compRef, setCompRef] = useState<AnyComponentRef | null>(null);

  useEffect(() => {
    createApplication().then(setAppRef);
    return () => {
      appRef?.destroy();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (appRef && hostRef.current) {
      setCompRef(
        createComponent(props.component, {
          environmentInjector: appRef.injector,
          hostElement: hostRef.current!,
        })
      );
    }
  }, [appRef, props.component]);

  useEffect(() => {
    if (compRef) {
      for (const [key, value] of Object.entries(props.inputs || {})) {
        compRef.setInput(key, value);
      }
      compRef.changeDetectorRef.detectChanges();
    }
  }, [compRef, props.inputs]);

  return <div ref={hostRef} />;
};